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
  student?: any;
  teacher?: any;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'authUser';

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
        tap((response) => {
          this.storeToken(response.token);
          this.storeUser(response.student);
        })
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
        tap((response) => {
          this.storeToken(response.token);
          this.storeUser(response.teacher);
        })
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
   * Stores the user information in the browser's localStorage.
   * @param user The user object (student or teacher).
   */
  private storeUser(user: any): void {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
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
   * Retrieves the user information from localStorage.
   * @returns The user object or null if not found.
   */
  getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Logs the user out by removing the token and user information from localStorage.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // You might also want to redirect the user to the login page here.
  }
}

