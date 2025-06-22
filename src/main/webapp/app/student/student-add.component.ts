import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { StudentService } from 'app/student/student.service';
import { StudentDTO } from 'app/student/student.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-student-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './student-add.component.html'
})
export class StudentAddComponent implements OnInit {

  studentService = inject(StudentService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  filiereValues?: Map<number, string>;

  addForm = new FormGroup({
    apogeeNumber: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    firstName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    email: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    password: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    filiere: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@student.create.success:Student was created successfully.`,
      STUDENT_APOGEE_NUMBER_VALID: $localize`:@@Exists.student.apogeeNumber:This Apogee Number is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.studentService.getFiliereValues()
      .subscribe({
        next: (data) => this.filiereValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new StudentDTO(this.addForm.value);
    this.studentService.createStudent(data)
      .subscribe({
        next: () => this.router.navigate(['/students'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }

}
