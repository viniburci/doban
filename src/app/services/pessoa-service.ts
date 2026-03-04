import { Injectable } from '@angular/core';
import { PessoaFormData } from '../entities/pessoaFormaData.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { SUPPRESS_ERROR_NOTIFICATION } from './http-error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private baseUrl = 'https://cadastro-pessoas-docs.onrender.com/api/v1/pessoa';

  constructor(private http: HttpClient) {}

  buscarTodasPessoas(): Observable<PessoaFormData[]> {
    return this.http.get<PessoaFormData[]>(this.baseUrl);
  }

  buscarPessoa(pessoaId: number, context?: HttpContext): Observable<PessoaFormData> {
    return this.http.get<PessoaFormData>(`${this.baseUrl}/${pessoaId}`, { context });
  }

  buscarPessoasAtivas(): Observable<PessoaFormData[]> {
    return this.http.get<PessoaFormData[]>(`${this.baseUrl}/ativas`);
  }

  buscarPessoasInativas(): Observable<PessoaFormData[]> {
    return this.http.get<PessoaFormData[]>(`${this.baseUrl}/inativas`);
  }

  criarPessoa(pessoa: PessoaFormData): Observable<PessoaFormData> {
    return this.http.post<PessoaFormData>(this.baseUrl, pessoa);
  }

  atualizarPessoa(id: number, pessoa: PessoaFormData): Observable<PessoaFormData> {
    return this.http.put<PessoaFormData>(`${this.baseUrl}/atualizar/${id}`, pessoa);
  }

  deletarPessoa(pessoaId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${pessoaId}`);
  }

  uploadFoto(pessoaId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post(`${this.baseUrl}/${pessoaId}/foto`, formData, { responseType: 'text' });
  }

  buscarFoto(pessoaId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${pessoaId}/foto`, {
      responseType: 'blob',
      context: new HttpContext().set(SUPPRESS_ERROR_NOTIFICATION, true)
    });
  }
}
