import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from 'auth/auth.service';

interface MessageDTO {
  id: number;
  content: string;
  sentAt: string;
  senderUser: number;
  senderName: string;
  isCurrentUser?: boolean; // allow for local UI use
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
  authService = inject(AuthService);
  messages: MessageDTO[] = [];
  loading = false;
  error: string | null = null;
  messageControl = new FormControl('', [Validators.required, Validators.maxLength(1000)]);
  apiUrl = environment.apiUrl;
  currentUserId: number | null = null;

  ngOnInit(): void {
    // Get current user id for chat alignment
    const user = this.authService.getUser();
    this.currentUserId = user?.id ?? null;

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
    const user = this.authService.getUser();
    const currentUserId = user?.id ?? user?.user ?? user?.apogeeNumber ?? null;
    this.http.get<MessageDTO[]>(`${this.apiUrl}/api/messages/module/${this.moduleId}`).subscribe({
      next: msgs => {
        // Mark messages sent by current user
        this.messages = msgs.map(msg => ({
          ...msg,
          isCurrentUser: msg.senderUser === currentUserId
        }));
        this.currentUserId = currentUserId;
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
    const user = this.authService.getUser();
    const now = new Date().toISOString();
    const senderName = user ? (user.firstName + ' ' + user.lastName) : 'Moi';
    this.http.post(`${this.apiUrl}/api/messages`, {
      modulee: this.moduleId,
      content,
      senderUser: user.user,
      sentAt: now,
      senderName
    }).subscribe({
      next: () => {
        // Immediately add the message to the DOM
        this.messages.push({
          id: Date.now(), // Temporary ID
          content: content || '',
          sentAt: now,
          senderUser: user.user ?? user.id ?? user.apogeeNumber,
          senderName,
          isCurrentUser: true
        });
        this.messageControl.reset();
      },
      error: () => {
        this.error = 'Erreur lors de l\'envoi du message.';
      }
    });
  }
}
