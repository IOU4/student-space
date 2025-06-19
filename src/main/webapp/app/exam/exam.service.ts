import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ExamDTO } from 'app/exam/exam.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ExamService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/exams';

  getAllExams() {
    return this.http.get<ExamDTO[]>(this.resourcePath);
  }

  getExam(id: number) {
    return this.http.get<ExamDTO>(this.resourcePath + '/' + id);
  }

  createExam(examDTO: ExamDTO) {
    return this.http.post<number>(this.resourcePath, examDTO);
  }

  updateExam(id: number, examDTO: ExamDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, examDTO);
  }

  deleteExam(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getModuleeValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/moduleeValues')
        .pipe(map(transformRecordToMap));
  }

}
