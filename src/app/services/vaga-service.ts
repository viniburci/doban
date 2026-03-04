import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VagaFormData } from '../entities/vagaFormData.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VagaService {

  private apiUrl = `${environment.apiUrl}/api/v1/vaga`;
  constructor(private http: HttpClient) { }

  getVagaPorPessoa(pessoaId: number): Observable<VagaFormData[]> {
    return this.http.get<VagaFormData[]>(`${this.apiUrl}/pessoa/${pessoaId}`);
  }

  getVagaMaisRecentePorPessoa(pessoaId: number): Observable<VagaFormData> {
    return this.http.get<VagaFormData>(`${this.apiUrl}/mais-recente/${pessoaId}`);
  }

  criarVaga(pessoaId: number, VagaFormData: VagaFormData): Observable<VagaFormData> {
    return this.http.post<VagaFormData>(`${this.apiUrl}/criar/${pessoaId}`, VagaFormData);
  }

  atualizarVaga(VagaFormDataId: number, VagaFormData: VagaFormData): Observable<VagaFormData> {
    return this.http.put<VagaFormData>(`${this.apiUrl}/atualizar/${VagaFormDataId}`, VagaFormData);
  }

  deletarVaga(VagaFormDataId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${VagaFormDataId}`);
  }

}

