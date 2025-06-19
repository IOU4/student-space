import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  environment = environment;

  ngOnInit(): void {
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    if (!token || !user || this.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      return;
    }
    // Check if student (has apogeeNumber)
    if (user.apogeeNumber) {
      this.router.navigate(['/dashboard']);
      return;
    }
    // Check if teacher (has email and no apogeeNumber)
    if (user.email && !user.apogeeNumber) {
      this.router.navigate(['/teacher/dashboard']);
      return;
    }
    // Fallback
    this.router.navigate(['/login']);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
