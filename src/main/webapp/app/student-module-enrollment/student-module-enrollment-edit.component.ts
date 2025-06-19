import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { StudentModuleEnrollmentService } from 'app/student-module-enrollment/student-module-enrollment.service';
import { StudentModuleEnrollmentDTO } from 'app/student-module-enrollment/student-module-enrollment.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-student-module-enrollment-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './student-module-enrollment-edit.component.html'
})
export class StudentModuleEnrollmentEditComponent implements OnInit {

  studentModuleEnrollmentService = inject(StudentModuleEnrollmentService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  studentUserValues?: Record<string,string>;
  moduleeValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    enrollmentDate: new FormControl(null),
    studentUser: new FormControl(null, [Validators.required]),
    modulee: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@studentModuleEnrollment.update.success:Student Module Enrollment was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.studentModuleEnrollmentService.getStudentUserValues()
        .subscribe({
          next: (data) => this.studentUserValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.studentModuleEnrollmentService.getModuleeValues()
        .subscribe({
          next: (data) => this.moduleeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.studentModuleEnrollmentService.getStudentModuleEnrollment(this.currentId!)
        .subscribe({
          next: (data) => updateForm(this.editForm, data),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.editForm.markAllAsTouched();
    if (!this.editForm.valid) {
      return;
    }
    const data = new StudentModuleEnrollmentDTO(this.editForm.value);
    this.studentModuleEnrollmentService.updateStudentModuleEnrollment(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/studentModuleEnrollments'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
