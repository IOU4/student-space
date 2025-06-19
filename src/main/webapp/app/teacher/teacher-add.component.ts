import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TeacherService } from 'app/teacher/teacher.service';
import { TeacherDTO } from 'app/teacher/teacher.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-teacher-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './teacher-add.component.html'
})
export class TeacherAddComponent implements OnInit {

  teacherService = inject(TeacherService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  userValues?: Map<number,string>;

  addForm = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    specialty: new FormControl(null, [Validators.maxLength(255)]),
    createdAt: new FormControl(null, [validOffsetDateTime]),
    user: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@teacher.create.success:Teacher was created successfully.`,
      TEACHER_FIRST_NAME_VALID: $localize`:@@Exists.teacher.firstName:This First Name is already taken.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.teacherService.getUserValues()
        .subscribe({
          next: (data) => this.userValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new TeacherDTO(this.addForm.value);
    this.teacherService.createTeacher(data)
        .subscribe({
          next: () => this.router.navigate(['/teachers'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
