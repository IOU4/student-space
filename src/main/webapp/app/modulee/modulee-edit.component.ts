import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ModuleeService } from 'app/modulee/modulee.service';
import { ModuleeDTO } from 'app/modulee/modulee.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm } from 'app/common/utils';


@Component({
  selector: 'app-modulee-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './modulee-edit.component.html'
})
export class ModuleeEditComponent implements OnInit {

  moduleeService = inject(ModuleeService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  filiereValues?: Map<number, string>;
  teacherValues?: Record<string, string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    description: new FormControl(null),
    filiere: new FormControl(null, [Validators.required]),
    teacher: new FormControl(null)
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@modulee.update.success:Modulee was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
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
    this.moduleeService.getModulee(this.currentId!)
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
    const data = new ModuleeDTO(this.editForm.value);
    this.moduleeService.updateModulee(this.currentId!, data)
      .subscribe({
        next: () => this.router.navigate(['/modulees'], {
          state: {
            msgSuccess: this.getMessage('updated')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
      });
  }

}
