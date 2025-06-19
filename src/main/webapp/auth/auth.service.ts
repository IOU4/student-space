import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

// --- Data Transfer Objects (DTOs) and Interfaces ---

// DTO for student login payload
export interface StudentLoginDTO {
  apogeeNumber: string;
}

// DTO for teacher login payload
export interface TeacherLoginDTO {
  email: string;
  password?: string;
}

// Interface for the authentication response from the backend
export interface AuthResponse {
  token: string;
  user: any; // Could be a more specific StudentDTO or TeacherDTO
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  private readonly TOKEN_KEY = 'authToken';

  /**
   * Logs in a student using their APOGEE number.
   * @param credentials The student's APOGEE number.
   * @returns An Observable with the AuthResponse (token and user object).
   */
  loginStudent(credentials: StudentLoginDTO): Observable<AuthResponse> {
    // POST request to the student login endpoint
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/login/student`, credentials)
      .pipe(
        // Use tap to perform a side effect: storing the token
        tap((response) => this.storeToken(response.token))
      );
  }

  /**
   * Logs in a teacher using their email and password.
   * @param credentials The teacher's email and password.
   * @returns An Observable with the AuthResponse (token and user object).
   */
  loginTeacher(credentials: TeacherLoginDTO): Observable<AuthResponse> {
    // POST request to the teacher login endpoint
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/login/teacher`, credentials)
      .pipe(
        // Use tap to perform a side effect: storing the token
        tap((response) => this.storeToken(response.token))
      );
  }

  /**
   * Stores the JWT token in the browser's localStorage.
   * @param token The JWT token string.
   */
  private storeToken(token: string): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Retrieves the JWT token from localStorage.
   * @returns The token string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Logs the user out by removing the token from localStorage.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // You might also want to redirect the user to the login page here.
  }
}

