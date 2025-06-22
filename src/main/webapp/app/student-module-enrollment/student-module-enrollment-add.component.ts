import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { StudentModuleEnrollmentService } from 'app/student-module-enrollment/student-module-enrollment.service';
import { StudentModuleEnrollmentDTO } from 'app/student-module-enrollment/student-module-enrollment.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-student-module-enrollment-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './student-module-enrollment-add.component.html'
})
export class StudentModuleEnrollmentAddComponent implements OnInit {

  studentModuleEnrollmentService = inject(StudentModuleEnrollmentService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  students?: Record<string, string>;
  modulees?: Map<number, string>;

  addForm = new FormGroup({
    enrollmentDate: new FormControl(null),
    student: new FormControl(null, [Validators.required]),
    modulee: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@studentModuleEnrollment.create.success:Student Module Enrollment was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.studentModuleEnrollmentService.getStudentUserValues()
      .subscribe({
        next: (data) => this.students = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.studentModuleEnrollmentService.getModuleeValues()
      .subscribe({
        next: (data) => this.modulees = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new StudentModuleEnrollmentDTO(this.addForm.value);
    this.studentModuleEnrollmentService.createStudentModuleEnrollment(data)
      .subscribe({
        next: () => this.router.navigate(['/studentModuleEnrollments'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }

}
