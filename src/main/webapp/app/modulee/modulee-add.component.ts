import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ModuleeService } from 'app/modulee/modulee.service';
import { ModuleeDTO } from 'app/modulee/modulee.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';

@Component({
  selector: 'app-modulee-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './modulee-add.component.html'
})
export class ModuleeAddComponent implements OnInit {

  moduleeService = inject(ModuleeService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  filiereValues?: Map<number, string>;
  teacherValues?: Record<number, string>;

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    description: new FormControl(null),
    filiere: new FormControl(null, [Validators.required]),
    teacher: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@modulee.create.success:Modulee was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.moduleeService.getFiliereValues()
      .subscribe({
        next: (data) => this.filiereValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
    this.moduleeService.getTeacherValues()
      .subscribe({
        next: (data) => this.teacherValues = data,
        error: (error) => this.errorHandler.handleServerError(error.error)
      });
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new ModuleeDTO(this.addForm.value);
    this.moduleeService.createModulee(data)
      .subscribe({
        next: () => this.router.navigate(['/modulees'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }

}
