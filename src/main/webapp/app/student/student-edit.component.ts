import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { StudentService } from 'app/student/student.service';
import { StudentDTO } from 'app/student/student.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-student-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './student-edit.component.html'
})
export class StudentEditComponent implements OnInit {

  studentService = inject(StudentService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;
  filiereValues?: Map<number,string>;
  currentApogeeNumber?: string;

  editForm = new FormGroup({
    apogeeNumber: new FormControl({ value: null, disabled: true }),
    firstName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    createdAt: new FormControl(null, [validOffsetDateTime]),
    user: new FormControl(null),
    filiere: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@student.update.success:Student was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentApogeeNumber = this.route.snapshot.params['apogeeNumber'];
    this.studentService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.studentService.getFiliereValues()
        .subscribe({
          next: (data) => this.filiereValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.studentService.getStudent(this.currentApogeeNumber!)
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
    const data = new StudentDTO(this.editForm.value);
    this.studentService.updateStudent(this.currentApogeeNumber!, data)
        .subscribe({
          next: () => this.router.navigate(['/students'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
