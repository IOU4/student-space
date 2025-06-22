import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { TeacherService } from 'app/teacher/teacher.service';
import { TeacherDTO } from 'app/teacher/teacher.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-teacher-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './teacher-edit.component.html'
})
export class TeacherEditComponent implements OnInit {

  teacherService = inject(TeacherService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentFirstName?: string;

  editForm = new FormGroup({
    firstName: new FormControl({ value: null, disabled: true }),
    lastName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    specialty: new FormControl(null, [Validators.maxLength(255)]),
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@teacher.update.success:Teacher was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentFirstName = this.route.snapshot.params['firstName'];
    this.teacherService.getTeacher(this.currentFirstName!)
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
    const data = new TeacherDTO(this.editForm.value);
    this.teacherService.updateTeacher(this.currentFirstName!, data)
      .subscribe({
        next: () => this.router.navigate(['/teachers'], {
          state: {
            msgSuccess: this.getMessage('updated')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
      });
  }

}
