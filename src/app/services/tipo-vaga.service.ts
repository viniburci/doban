import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoVagaCreateDTO, TipoVagaDTO, TipoVagaUpdateDTO } from '../entities/tipo-vaga.model';

@Injectable({
  providedIn: 'root'
})
export class TipoVagaService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/tipos-vaga';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<TipoVagaDTO[]> {
    return this.http.get<TipoVagaDTO[]>(this.baseUrl);
  }

  listarAtivos(): Observable<TipoVagaDTO[]> {
    return this.http.get<TipoVagaDTO[]>(`${this.baseUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<TipoVagaDTO> {
    return this.http.get<TipoVagaDTO>(`${this.baseUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<TipoVagaDTO> {
    return this.http.get<TipoVagaDTO>(`${this.baseUrl}/codigo/${codigo}`);
  }

  criar(dto: TipoVagaCreateDTO): Observable<TipoVagaDTO> {
    return this.http.post<TipoVagaDTO>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: TipoVagaUpdateDTO): Observable<TipoVagaDTO> {
    return this.http.put<TipoVagaDTO>(`${this.baseUrl}/${id}`, dto);
  }

  adicionarRecursoPermitido(tipoVagaId: number, tipoRecursoId: number): Observable<TipoVagaDTO> {
    return this.http.post<TipoVagaDTO>(
      `${this.baseUrl}/${tipoVagaId}/recursos-permitidos/${tipoRecursoId}`,
      {}
    );
  }

  removerRecursoPermitido(tipoVagaId: number, tipoRecursoId: number): Observable<TipoVagaDTO> {
    return this.http.delete<TipoVagaDTO>(
      `${this.baseUrl}/${tipoVagaId}/recursos-permitidos/${tipoRecursoId}`
    );
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deletarPermanente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/permanente`);
  }
}
