import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Celular } from '../entities/celular.model';
import { CelularFormData } from '../entities/celularFormData.model';

@Injectable({
  providedIn: 'root'
})
export class CelularService {
  private apiUrl = 'http://localhost:8080/api/v1/celular'

  constructor(private http: HttpClient) {}

  listar(): Observable<CelularFormData[]> {
    return this.http.get<CelularFormData[]>(this.apiUrl);
  }

  buscarTodos(): Observable<CelularFormData[]> {
    return this.http.get<CelularFormData[]>(`${this.apiUrl}`);
  }

  buscarPorId(id: number): Observable<CelularFormData> {
    return this.http.get<CelularFormData>(`${this.apiUrl}/${id}`);
  }

  criar(celular: CelularFormData): Observable<CelularFormData> {
    return this.http.post<CelularFormData>(this.apiUrl, celular);
  }

  atualizar(id: number, celular: CelularFormData): Observable<CelularFormData> {
    return this.http.put<CelularFormData>(`${this.apiUrl}/${id}`, celular);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
