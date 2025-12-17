import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RocadeiraRequestDTO } from '../entities/rocadeiraRequestDTO.model';
import { RocadeiraResponseDTO } from '../entities/rocadeiraResponseDTO.model';

@Injectable({
  providedIn: 'root'
})
export class RocadeiraService {
  private baseUrl = 'http://localhost:8080/api/v1/rocadeira';

  constructor(private http: HttpClient) { }

  listarRocadeiras(): Observable<RocadeiraResponseDTO[]> {
    return this.http.get<RocadeiraResponseDTO[]>(`${this.baseUrl}`);
  }

  buscarPorId(id: number): Observable<RocadeiraResponseDTO> {
    return this.http.get<RocadeiraResponseDTO>(`${this.baseUrl}/${id}`);
  }

  buscarPorNumeroSerie(numeroSerie: string): Observable<RocadeiraResponseDTO> {
    return this.http.get<RocadeiraResponseDTO>  (`${this.baseUrl}/numero_serie/${numeroSerie}`);
  }

  criarRocadeira(data: RocadeiraRequestDTO): Observable<RocadeiraResponseDTO> {
    return this.http.post<RocadeiraResponseDTO>(`${this.baseUrl}`, data);
  }

  atualizarRocadeira(id: number, data: RocadeiraRequestDTO): Observable<RocadeiraResponseDTO> {
    return this.http.put<RocadeiraResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  deletarRocadeira(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
