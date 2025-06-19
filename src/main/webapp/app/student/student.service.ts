import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { StudentDTO } from 'app/student/student.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class StudentService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/students';

  getAllStudents() {
    return this.http.get<StudentDTO[]>(this.resourcePath);
  }

  getStudent(apogeeNumber: string) {
    return this.http.get<StudentDTO>(this.resourcePath + '/' + apogeeNumber);
  }

  createStudent(studentDTO: StudentDTO) {
    return this.http.post<string>(this.resourcePath, studentDTO);
  }

  updateStudent(apogeeNumber: string, studentDTO: StudentDTO) {
    return this.http.put<string>(this.resourcePath + '/' + apogeeNumber, studentDTO);
  }

  deleteStudent(apogeeNumber: string) {
    return this.http.delete(this.resourcePath + '/' + apogeeNumber);
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

  getFiliereValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/filiereValues')
        .pipe(map(transformRecordToMap));
  }

}
