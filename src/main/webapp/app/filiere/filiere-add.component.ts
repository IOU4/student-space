import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { FiliereService } from 'app/filiere/filiere.service';
import { FiliereDTO } from 'app/filiere/filiere.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';


@Component({
  selector: 'app-filiere-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './filiere-add.component.html'
})
export class FiliereAddComponent {

  filiereService = inject(FiliereService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  addForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    academicYear: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    semester: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    description: new FormControl(null),
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@filiere.create.success:Filiere was created successfully.`
    };
    return messages[key];
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new FiliereDTO(this.addForm.value);
    this.filiereService.createFiliere(data)
      .subscribe({
        next: () => this.router.navigate(['/filieres'], {
          state: {
            msgSuccess: this.getMessage('created')
          }
        }),
        error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
      });
  }

}
