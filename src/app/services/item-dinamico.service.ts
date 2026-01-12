import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemDinamicoCreateDTO, ItemDinamicoDTO, ItemDinamicoUpdateDTO } from '../entities/item-dinamico.model';

@Injectable({
  providedIn: 'root'
})
export class ItemDinamicoService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/itens';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<ItemDinamicoDTO[]> {
    return this.http.get<ItemDinamicoDTO[]>(this.baseUrl);
  }

  listarPorTipo(tipoRecursoCodigo: string): Observable<ItemDinamicoDTO[]> {
    return this.http.get<ItemDinamicoDTO[]>(`${this.baseUrl}/tipo/${tipoRecursoCodigo}`);
  }

  listarDisponiveis(tipoRecursoCodigo: string): Observable<ItemDinamicoDTO[]> {
    return this.http.get<ItemDinamicoDTO[]>(`${this.baseUrl}/disponiveis/${tipoRecursoCodigo}`);
  }

  buscarPorId(id: number): Observable<ItemDinamicoDTO> {
    return this.http.get<ItemDinamicoDTO>(`${this.baseUrl}/${id}`);
  }

  criar(dto: ItemDinamicoCreateDTO): Observable<ItemDinamicoDTO> {
    return this.http.post<ItemDinamicoDTO>(this.baseUrl, dto);
  }

  atualizar(id: number, dto: ItemDinamicoUpdateDTO): Observable<ItemDinamicoDTO> {
    return this.http.put<ItemDinamicoDTO>(`${this.baseUrl}/${id}`, dto);
  }

  desativar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  deletarPermanente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/permanente`);
  }
}
