import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TemplateDocumento,
  TemplateDocumentoCreate,
  TemplateDocumentoUpdate
} from '../entities/template-documento.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateDocumentoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/templates-documento';

  listarTodos(): Observable<TemplateDocumento[]> {
    return this.http.get<TemplateDocumento[]>(this.apiUrl);
  }

  listarAtivos(): Observable<TemplateDocumento[]> {
    return this.http.get<TemplateDocumento[]>(`${this.apiUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<TemplateDocumento> {
    return this.http.get<TemplateDocumento>(`${this.apiUrl}/${id}`);
  }

  buscarPorCodigo(codigo: string): Observable<TemplateDocumento> {
    return this.http.get<TemplateDocumento>(`${this.apiUrl}/codigo/${codigo}`);
  }

  listarPorTipoVaga(tipoVagaId: number): Observable<TemplateDocumento[]> {
    return this.http.get<TemplateDocumento[]>(`${this.apiUrl}/tipo-vaga/${tipoVagaId}`);
  }

  criar(dto: TemplateDocumentoCreate): Observable<TemplateDocumento> {
    return this.http.post<TemplateDocumento>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: TemplateDocumentoUpdate): Observable<TemplateDocumento> {
    return this.http.put<TemplateDocumento>(`${this.apiUrl}/${id}`, dto);
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
