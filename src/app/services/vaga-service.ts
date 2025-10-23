import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VagaFormData } from '../entities/vagaFormData.model';

@Injectable({
  providedIn: 'root'
})
export class VagaFormDataFormDataService {

  private apiUrl = 'http://localhost:8080/api/v1/vaga'; 
  constructor(private http: HttpClient) { }

  getVagaFormDatasPorPessoa(pessoaId: number): Observable<VagaFormData[]> {
    return this.http.get<VagaFormData[]>(`${this.apiUrl}/pessoa/${pessoaId}`);
  }

  getVagaFormDataMaisRecentePorPessoa(pessoaId: number): Observable<VagaFormData> {
    return this.http.get<VagaFormData>(`${this.apiUrl}/mais-recente/${pessoaId}`);
  }

  criarVagaFormData(pessoaId: number, VagaFormData: VagaFormData): Observable<VagaFormData> {
    return this.http.post<VagaFormData>(`${this.apiUrl}/criar/${pessoaId}`, VagaFormData);
  }

  atualizarVagaFormData(VagaFormDataId: number, VagaFormData: VagaFormData): Observable<VagaFormData> {
    return this.http.put<VagaFormData>(`${this.apiUrl}/atualizar/${VagaFormDataId}`, VagaFormData);
  }

  deletarVagaFormData(VagaFormDataId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${VagaFormDataId}`);
  }

}

