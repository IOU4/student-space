import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ModuleeDTO } from 'app/modulee/modulee.model';
import { map } from 'rxjs';
import { transformRecordToMap } from 'app/common/utils';


@Injectable({
  providedIn: 'root',
})
export class ModuleeService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/modulees';

  getAllModulees() {
    return this.http.get<ModuleeDTO[]>(this.resourcePath);
  }

  getModulee(id: number) {
    return this.http.get<ModuleeDTO>(this.resourcePath + '/' + id);
  }

  createModulee(moduleeDTO: ModuleeDTO) {
    return this.http.post<number>(this.resourcePath, moduleeDTO);
  }

  updateModulee(id: number, moduleeDTO: ModuleeDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, moduleeDTO);
  }

  deleteModulee(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

  getFiliereValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/filiereValues')
        .pipe(map(transformRecordToMap));
  }

  getTeacherValues() {
    return this.http.get<Record<string, string>>(this.resourcePath + '/teacherValues');
  }

}
