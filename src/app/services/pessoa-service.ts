import { Injectable } from '@angular/core';
import { PessoaFormData } from '../entities/pessoaFormaData.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private baseUrl = 'http://localhost:8080/api/v1/pessoa';

  constructor(private http: HttpClient) {}

  buscarTodasPessoas(): Observable<PessoaFormData[]> {
    return this.http.get<PessoaFormData[]>(this.baseUrl);
  }

  buscarPessoa(pessoaId: number): Observable<PessoaFormData> {
    return this.http.get<PessoaFormData>(`${this.baseUrl}/${pessoaId}`);
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
}
