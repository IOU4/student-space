import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { TeacherDTO } from 'app/teacher/teacher.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class TeacherService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/teachers';

  getAllTeachers() {
    return this.http.get<TeacherDTO[]>(this.resourcePath);
  }

  getTeacher(firstName: string) {
    return this.http.get<TeacherDTO>(this.resourcePath + '/' + firstName);
  }

  createTeacher(teacherDTO: TeacherDTO) {
    return this.http.post<string>(this.resourcePath, teacherDTO);
  }

  updateTeacher(firstName: string, teacherDTO: TeacherDTO) {
    return this.http.put<string>(this.resourcePath + '/' + firstName, teacherDTO);
  }

  deleteTeacher(firstName: string) {
    return this.http.delete(this.resourcePath + '/' + firstName);
  }

  getUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/userValues')
        .pipe(map(transformRecordToMap));
  }

}
