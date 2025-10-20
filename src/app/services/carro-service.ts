import { Injectable } from '@angular/core';
import { CarroFormData } from '../entities/carroFormData.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarroService {
  private apiUrl = 'http://localhost:8080/api/v1/carros';

  constructor(private http: HttpClient) {}

  listar(): Observable<CarroFormData[]> {
    return this.http.get<CarroFormData[]>(this.apiUrl);
  }

  buscar(id: number): Observable<CarroFormData> {
    return this.http.get<CarroFormData>(`${this.apiUrl}/${id}`);
  }

  criar(carro: CarroFormData): Observable<CarroFormData> {
    return this.http.post<CarroFormData>(this.apiUrl, carro);
  }

  atualizar(id: number, carro: CarroFormData): Observable<CarroFormData> {
    return this.http.put<CarroFormData>(`${this.apiUrl}/${id}`, carro);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
