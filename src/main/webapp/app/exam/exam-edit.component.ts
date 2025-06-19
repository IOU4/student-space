import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { ExamService } from 'app/exam/exam.service';
import { ExamDTO } from 'app/exam/exam.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-exam-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './exam-edit.component.html'
})
export class ExamEditComponent implements OnInit {

  examService = inject(ExamService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  moduleeValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    title: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
    examYear: new FormControl(null, [Validators.required]),
    fileUrl: new FormControl(null, [Validators.required, Validators.maxLength(512)]),
    uploadedAt: new FormControl(null, [validOffsetDateTime]),
    modulee: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@exam.update.success:Exam was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.examService.getModuleeValues()
        .subscribe({
          next: (data) => this.moduleeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.examService.getExam(this.currentId!)
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
    const data = new ExamDTO(this.editForm.value);
    this.examService.updateExam(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/exams'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
