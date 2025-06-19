import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { FiliereDTO } from 'app/filiere/filiere.model';


@Injectable({
  providedIn: 'root',
})
export class FiliereService {

  http = inject(HttpClient);
  resourcePath = environment.apiPath + '/api/filieres';

  getAllFilieres() {
    return this.http.get<FiliereDTO[]>(this.resourcePath);
  }

  getFiliere(id: number) {
    return this.http.get<FiliereDTO>(this.resourcePath + '/' + id);
  }

  createFiliere(filiereDTO: FiliereDTO) {
    return this.http.post<number>(this.resourcePath, filiereDTO);
  }

  updateFiliere(id: number, filiereDTO: FiliereDTO) {
    return this.http.put<number>(this.resourcePath + '/' + id, filiereDTO);
  }

  deleteFiliere(id: number) {
    return this.http.delete(this.resourcePath + '/' + id);
  }

}
