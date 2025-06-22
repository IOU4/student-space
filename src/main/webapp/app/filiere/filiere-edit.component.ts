import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { FiliereService } from 'app/filiere/filiere.service';
import { FiliereDTO } from 'app/filiere/filiere.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-filiere-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './filiere-edit.component.html'
})
export class FiliereEditComponent implements OnInit {

  filiereService = inject(FiliereService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    academicYear: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    description: new FormControl(null),
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@filiere.update.success:Filiere was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.filiereService.getFiliere(this.currentId!)
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
    const data = new FiliereDTO(this.editForm.value);
    this.filiereService.updateFiliere(this.currentId!, data)
      .subscribe({
        next: () => this.router.navigate(['/filieres'], {
          state: {
            msgSuccess: this.getMessage('updated')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
      });
  }

}
