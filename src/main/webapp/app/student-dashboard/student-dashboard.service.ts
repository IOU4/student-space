import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StudentDTO {
  apogeeNumber: string;
  firstName: string;
  lastName: string;
  filiere: string;
}

export interface StudentModuleEnrollmentDTO {
  id: number;
  student: string; // apogeeNumber
  modulee: number; // module id
  groupNumber?: number;
}

export interface ModuleeDTO {
  id: number;
  name: string;
  teacherName: string;
}

@Injectable({ providedIn: 'root' })
export class StudentDashboardService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getStudent(apogeeNumber: string): Observable<StudentDTO> {
    return this.http.get<StudentDTO>(`${this.apiUrl}/api/students/${apogeeNumber}`);
  }

  getStudentModuleEnrollments(): Observable<StudentModuleEnrollmentDTO[]> {
    return this.http.get<StudentModuleEnrollmentDTO[]>(`${this.apiUrl}/api/studentModuleEnrollments`);
  }

  getModulee(moduleId: number): Observable<ModuleeDTO> {
    return this.http.get<ModuleeDTO>(`${this.apiUrl}/api/modulees/${moduleId}`);
  }
}
