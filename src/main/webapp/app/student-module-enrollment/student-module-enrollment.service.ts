import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { StudentModuleEnrollmentDTO } from 'app/student-module-enrollment/student-module-enrollment.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class StudentModuleEnrollmentService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/studentModuleEnrollments';

  getAllStudentModuleEnrollments() {
    return this.http.get<StudentModuleEnrollmentDTO[]>(this.resourcePath);
  }

  getStudentModuleEnrollment(id: number) {
    return this.http.get<StudentModuleEnrollmentDTO>(this.resourcePath + '/' + id);
  }

  createStudentModuleEnrollment(studentModuleEnrollmentDTO: StudentModuleEnrollmentDTO) {
    return this.http.post<number>(this.resourcePath, studentModuleEnrollmentDTO);
  }

  updateStudentModuleEnrollment(id: number, studentModuleEnrollmentDTO: StudentModuleEnrollmentDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, studentModuleEnrollmentDTO);
  }

  deleteStudentModuleEnrollment(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getStudentUserValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/studentUserValues');
  }

  getModuleeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/moduleeValues')
        .pipe(map(transformRecordToMap));
  }

}
