import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecursoCarroResponseDTO } from '../entities/recursoCarroResponseDTO.model';
import { RecursoCarroRequestDTO } from '../entities/recursoCarroRequestDTO.model';
import { RecursoCelularRequestDTO } from '../entities/recursoCelularRequestDTO.model';
import { RecursoCelularResponseDTO } from '../entities/recursoCelularResponseDTO.model';
import { DevolucaoDTO } from '../entities/devolucaoDTO.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  private baseUrl = 'http://localhost:8080/recursos';

  constructor(private http: HttpClient) { }


  getRecursosCelulares(): Observable<RecursoCelularResponseDTO[]> {
    return this.http.get<RecursoCelularResponseDTO[]>(`${this.baseUrl}/celulares`);
  }

  createRecursoCelular(request: RecursoCelularRequestDTO): Observable<RecursoCelularResponseDTO> {
    return this.http.post<RecursoCelularResponseDTO>(`${this.baseUrl}/celulares`, request);
  }

  getRecursoCelularById(id: number): Observable<RecursoCelularResponseDTO> {
    return this.http.get<RecursoCelularResponseDTO>(`${this.baseUrl}/celulares/${id}`);
  }

  getRecursoCelularByPessoaId(pessoaId: number): Observable<RecursoCelularResponseDTO[]> {
    return this.http.get<RecursoCelularResponseDTO[]>(`${this.baseUrl}/celulares/pessoa/${pessoaId}`);
  }

  registrarDevolucaoCelular(recursoId: number, devolucaoDto: DevolucaoDTO): Observable<RecursoCelularResponseDTO> {
    return this.http.put<RecursoCelularResponseDTO>(`${this.baseUrl}/celulares/${recursoId}/devolucao`, devolucaoDto);
  }

  deleteRecursoCelular(recursoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/celulares/${recursoId}`);
  }

  getRecursosCarros(): Observable<RecursoCarroResponseDTO[]> {
    return this.http.get<RecursoCarroResponseDTO[]>(`${this.baseUrl}/carros`);
  }

  createRecursoCarro(request: RecursoCarroRequestDTO): Observable<RecursoCarroResponseDTO> {
    return this.http.post<RecursoCarroResponseDTO>(`${this.baseUrl}/carros`, request);
  }

  getRecursoCarroById(id: number): Observable<RecursoCarroResponseDTO> {
    return this.http.get<RecursoCarroResponseDTO>(`${this.baseUrl}/carros/${id}`);
  }

  registrarDevolucaoCarro(id: number, dto: DevolucaoDTO): Observable<RecursoCarroResponseDTO> {
    return this.http.put<RecursoCarroResponseDTO>(`${this.baseUrl}/carros/${id}/devolucao`, dto);
  }

  deleteRecursoCarro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/carros/${id}`);
  }
}
