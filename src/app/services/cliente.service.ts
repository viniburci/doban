import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteDTO, ClienteCreateDTO } from '../entities/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/api/v1/clientes';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(this.apiUrl);
  }

  listarAtivos(): Observable<ClienteDTO[]> {
    return this.http.get<ClienteDTO[]>(`${this.apiUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<ClienteDTO> {
    return this.http.get<ClienteDTO>(`${this.apiUrl}/${id}`);
  }

  criar(dto: ClienteCreateDTO): Observable<ClienteDTO> {
    return this.http.post<ClienteDTO>(this.apiUrl, dto);
  }

  atualizar(id: number, dto: ClienteCreateDTO): Observable<ClienteDTO> {
    return this.http.put<ClienteDTO>(`${this.apiUrl}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  alternarAtivo(id: number): Observable<ClienteDTO> {
    return this.http.patch<ClienteDTO>(`${this.apiUrl}/${id}/toggle-ativo`, {});
  }
}
