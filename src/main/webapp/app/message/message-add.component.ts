import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputRowComponent } from 'app/common/input-row/input-row.component';
import { MessageService } from 'app/message/message.service';
import { MessageDTO } from 'app/message/message.model';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { validOffsetDateTime } from 'app/common/utils';


@Component({
  selector: 'app-message-add',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputRowComponent],
  templateUrl: './message-add.component.html'
})
export class MessageAddComponent implements OnInit {

  messageService = inject(MessageService);
  router = inject(Router);
  errorHandler = inject(ErrorHandler);

  moduleeValues?: Map<number,string>;
  senderUserValues?: Map<number,string>;

  addForm = new FormGroup({
    content: new FormControl(null, [Validators.required]),
    sentAt: new FormControl(null, [validOffsetDateTime]),
    modulee: new FormControl(null, [Validators.required]),
    senderUser: new FormControl(null, [Validators.required])
  }, { updateOn: 'submit' });

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      created: $localize`:@@message.create.success:Message was created successfully.`
    };
    return messages[key];
  }

  ngOnInit() {
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
  }

  handleSubmit() {
    window.scrollTo(0, 0);
    this.addForm.markAllAsTouched();
    if (!this.addForm.valid) {
      return;
    }
    const data = new MessageDTO(this.addForm.value);
    this.messageService.createMessage(data)
        .subscribe({
          next: () => this.router.navigate(['/messages'], {
            state: {
              msgSuccess: this.getMessage('created')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error, this.addForm, this.getMessage)
        });
  }

}
