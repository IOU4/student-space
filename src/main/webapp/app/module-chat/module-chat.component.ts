import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'environments/environment';

interface MessageDTO {
  id: number;
  content: string;
  sentAt: string;
  senderUserId: number;
  senderName: string;
}

@Component({
  selector: 'app-module-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './module-chat.component.html',
  styleUrls: ['./module-chat.component.css']
})
export class ModuleChatComponent implements OnInit, OnChanges {
  @Input() moduleId?: number; // Allow parent to set moduleId
  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  messages: MessageDTO[] = [];
  loading = false;
  error: string | null = null;
  messageControl = new FormControl('', [Validators.required, Validators.maxLength(1000)]);
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    // If moduleId is not set by parent, try to get it from route params (for standalone use)
    if (this.moduleId == null) {
      this.route.params.subscribe(params => {
        this.moduleId = +params['moduleId'];
        this.loadMessages();
      });
    } else {
      this.loadMessages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moduleId'] && !changes['moduleId'].firstChange) {
      this.loadMessages();
    }
  }

  loadMessages(): void {
    if (!this.moduleId) return;
    this.loading = true;
    this.http.get<MessageDTO[]>(`${this.apiUrl}/api/messages/module/${this.moduleId}`).subscribe({
      next: msgs => {
        this.messages = msgs;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des messages.';
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (this.messageControl.invalid || !this.moduleId) return;
    const content = this.messageControl.value;
    this.http.post(`${this.apiUrl}/api/messages`, {
      modulee: this.moduleId,
      content
    }).subscribe({
      next: () => {
        this.messageControl.reset();
        this.loadMessages();
      },
      error: () => {
        this.error = 'Erreur lors de l\'envoi du message.';
      }
    });
  }
}
