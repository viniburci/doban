import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoRecursoCreateDTO, TipoRecursoDTO, TipoRecursoUpdateDTO } from '../entities/tipo-recurso.model';

@Injectable({
  providedIn: 'root'
})
export class TipoRecursoService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/tipos-recurso';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<TipoRecursoDTO[]> {
    return this.http.get<TipoRecursoDTO[]>(this.baseUrl);
  }

  listarAtivos(): Observable<TipoRecursoDTO[]> {
    return this.http.get<TipoRecursoDTO[]>(`${this.baseUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<TipoRecursoDTO> {
    return this.http.get<TipoRecursoDTO>(`${this.baseUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<TipoRecursoDTO> {
    return this.http.get<TipoRecursoDTO>(`${this.baseUrl}/codigo/${codigo}`);
  }

  criar(dto: TipoRecursoCreateDTO): Observable<TipoRecursoDTO> {
    return this.http.post<TipoRecursoDTO>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: TipoRecursoUpdateDTO): Observable<TipoRecursoDTO> {
    return this.http.put<TipoRecursoDTO>(`${this.baseUrl}/${id}`, dto);
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deletarPermanente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/permanente`);
  }
}
