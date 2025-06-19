import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MessageService } from 'app/message/message.service';
import { MessageDTO } from 'app/message/message.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { updateForm, validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-message-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './message-edit.component.html'
})
export class MessageEditComponent implements OnInit {

  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  moduleeValues?: Map<number,string>;
  senderUserValues?: Map<number,string>;
  currentId?: number;

  editForm = new FormGroup({
    id: new FormControl({ value: null, disabled: true }),
    content: new FormControl(null, [Validators.required]),
    sentAt: new FormControl(null, [validOffsetDateTime]),
    modulee: new FormControl(null, [Validators.required]),
    senderUser: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      updated: $localize`:@@message.update.success:Message was updated successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
    this.currentId = +this.route.snapshot.params['id'];
    this.messageService.getModuleeValues()
        .subscribe({
          next: (data) => this.moduleeValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.messageService.getSenderUserValues()
        .subscribe({
          next: (data) => this.senderUserValues = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
    this.messageService.getMessage(this.currentId!)
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
    const data = new MessageDTO(this.editForm.value);
    this.messageService.updateMessage(this.currentId!, data)
        .subscribe({
          next: () => this.router.navigate(['/messages'], {
            state: {
              msgSuccess: this.getMessage('updated')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.editForm, this.getMessage)
        });
  }

}
