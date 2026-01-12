import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DevolucaoDinamicaDTO, RecursoDinamicoCreateDTO, RecursoDinamicoDTO } from '../entities/recurso-dinamico.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoDinamicoService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/recursos-dinamicos';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<RecursoDinamicoDTO[]> {
    return this.http.get<RecursoDinamicoDTO[]>(this.baseUrl);
  }

  listarPorPessoa(pessoaId: number): Observable<RecursoDinamicoDTO[]> {
    return this.http.get<RecursoDinamicoDTO[]>(`${this.baseUrl}/pessoa/${pessoaId}`);
  }

  listarAtivosParaPessoa(pessoaId: number): Observable<RecursoDinamicoDTO[]> {
    return this.http.get<RecursoDinamicoDTO[]>(`${this.baseUrl}/pessoa/${pessoaId}/ativos`);
  }

  listarPorTipoRecurso(tipoRecursoCodigo: string): Observable<RecursoDinamicoDTO[]> {
    return this.http.get<RecursoDinamicoDTO[]>(`${this.baseUrl}/tipo/${tipoRecursoCodigo}`);
  }

  buscarPorId(id: number): Observable<RecursoDinamicoDTO> {
    return this.http.get<RecursoDinamicoDTO>(`${this.baseUrl}/${id}`);
  }

  buscarAtivoParaItem(itemId: number): Observable<RecursoDinamicoDTO> {
    return this.http.get<RecursoDinamicoDTO>(`${this.baseUrl}/item/${itemId}/ativo`);
  }

  emprestar(dto: RecursoDinamicoCreateDTO): Observable<RecursoDinamicoDTO> {
    return this.http.post<RecursoDinamicoDTO>(this.baseUrl, dto);
  }

  registrarDevolucao(id: number, dto: DevolucaoDinamicaDTO): Observable<RecursoDinamicoDTO> {
    return this.http.put<RecursoDinamicoDTO>(`${this.baseUrl}/${id}/devolucao`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
