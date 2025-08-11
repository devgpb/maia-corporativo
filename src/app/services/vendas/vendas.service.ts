import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IDashboardVendas } from 'src/app/interfaces/IDashboardVendas';

type ApiResponse<T> = { success: boolean; data: T };

@Injectable({
  providedIn: 'root'
})
export class VendasService {

  constructor(private http: HttpClient) { }

  public getContatos(): Observable<any[]>{

		return this.http.get<any[]>(`${environment.apiURL}/vendas`)
	}

  public marcarContato(dados: any):Observable<any[]>{

		return this.http.post<any[]>(`${environment.apiURL}/automacao/marcarContato`, dados)
	}

  getAtendimento(periodo: 'hoje'|'semana'|'mes'): Observable<IDashboardVendas> {
    return this.http
      .get<ApiResponse<IDashboardVendas>>(`${environment.apiURL}/clientes/dashboard?periodo=${periodo}`)
      .pipe(map(res => res.data)); // << pega só o data
  }
}
