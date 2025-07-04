import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { UserService } from 'app/user/user.service';
import { UserDTO } from 'app/user/user.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-user-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './user-add.component.html'
})
export class UserAddComponent {

  userService = inject(UserService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    passwordHash: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    role: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    createdAt: new FormControl(null, [validOffsetDateTime])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@user.create.success:User was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new UserDTO(this.addForm.value);
    this.userService.createUser(data)
        .subscribe({
          next: () => this.router.navigate(['/users'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
