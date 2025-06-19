import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorHandler } from 'app/common/error-handler.injectable';
import { MessageService } from 'app/message/message.service';
import { MessageDTO } from 'app/message/message.model';


@Component({
  selector: 'app-message-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './message-list.component.html'})
export class MessageListComponent implements OnInit, OnDestroy {

  messageService = inject(MessageService);
  errorHandler = inject(ErrorHandler);
  router = inject(Router);
  messages?: MessageDTO[];
  navigationSubscription?: Subscription;

  getMessage(key: string, details?: any) {
    const messages: Record<string, string> = {
      confirm: $localize`:@@delete.confirm:Do you really want to delete this element? This cannot be undone.`,
      deleted: $localize`:@@message.delete.success:Message was removed successfully.`    };
    return messages[key];
  }

  ngOnInit() {
    this.loadData();
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription!.unsubscribe();
  }
  
  loadData() {
    this.messageService.getAllMessages()
        .subscribe({
          next: (data) => this.messages = data,
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

  confirmDelete(id: number) {
    if (!confirm(this.getMessage('confirm'))) {
      return;
    }
    this.messageService.deleteMessage(id)
        .subscribe({
          next: () => this.router.navigate(['/messages'], {
            state: {
              msgInfo: this.getMessage('deleted')
            }
          }),
          error: (error) => this.errorHandler.handleServerError(error.error)
        });
  }

}
