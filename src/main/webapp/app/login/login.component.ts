// login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { AuthService } from 'auth/auth.service'; // Import the new service
import { StudentLoginDTO, TeacherLoginDTO } from 'auth/auth.service'; // Import DTOs

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authService = inject(AuthService); // Inject the AuthService
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  activeTab: 'student' | 'teacher' = 'student';

  studentLoginForm = new FormGroup({
    apogeeNumber: new FormControl(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
  }, { updateOn: 'submit' });

  teacherLoginForm = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email,
      Validators.maxLength(255),
    ]),
    password: new FormControl(null, [Validators.required]),
  }, { updateOn: 'submit' });

  setActiveTab(tab: 'student' | 'teacher') {
    this.activeTab = tab;
  }

  /**
   * Handles the submission of the student login form.
   */
  handleStudentSubmit() {
    window.scrollTo(0, 0);
    this.studentLoginForm.markAllAsTouched();
    if (!this.studentLoginForm.valid) {
      return;
    }
    // Create the credentials object safely after validation
    const credentials: StudentLoginDTO = {
      apogeeNumber: this.studentLoginForm.value.apogeeNumber!
    };

    this.authService.loginStudent(credentials).subscribe({
      next: (response) => {
        console.log('Student logged in successfully!', response.user);
        this.router.navigate(['/dashboard']); // Redirect to dashboard on success
      },
      error: (error) => this.errorHandler.handleServerError(error.error, this.studentLoginForm),
    });
  }

  /**
   * Handles the submission of the teacher login form.
   */
  handleTeacherSubmit() {
    window.scrollTo(0, 0);
    this.teacherLoginForm.markAllAsTouched();
    if (!this.teacherLoginForm.valid) {
      return;
    }
    // Create the credentials object safely after validation
    const credentials: TeacherLoginDTO = {
      email: this.teacherLoginForm.value.email!,
      password: this.teacherLoginForm.value.password!
    };

    this.authService.loginTeacher(credentials).subscribe({
      next: (response) => {
        console.log('Teacher logged in successfully!', response.user);
        this.router.navigate(['/dashboard']); // Redirect to dashboard on success
      },
      error: (error) => this.errorHandler.handleServerError(error.error, this.teacherLoginForm),
    });
  }
}

