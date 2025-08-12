import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IDashboardVendas } from 'src/app/interfaces/IDashboardVendas';

export interface PaginationMeta {
  total: number; page: number; perPage: number; totalPages: number;
}
type ApiResponse<T> = { success: boolean; data: T };

export type PaginatedResponse<T> = { success: boolean; meta: PaginationMeta; data: T[] };

export type ClienteItem = {
  nome: string;
  updatedAt: string;
  status: string | null;
  observacao: string | null;
};

export type EventoItem = {
  data: string;
  evento: string | null;
  confirmado: boolean;
  usuario?: { nome: string | null } | null;
};

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
      .pipe(map(res => res.data));
  }

   // NOVOS métodos paginados
  getClientesNovosList(periodo: any, page=1, perPage=20): Observable<PaginatedResponse<ClienteItem>> {
    const params = new HttpParams().set('periodo', periodo).set('page', page).set('perPage', perPage);
    return this.http.get<PaginatedResponse<ClienteItem>>(`${environment.apiURL}/clientes/dashboard/clientes-novos`, { params });
  }
  getClientesAtendidosList(periodo: any, page=1, perPage=20): Observable<PaginatedResponse<ClienteItem>> {
    const params = new HttpParams().set('periodo', periodo).set('page', page).set('perPage', perPage);
    return this.http.get<PaginatedResponse<ClienteItem>>(`${environment.apiURL}/clientes/dashboard/clientes-atendidos`, { params });
  }
  getClientesFechadosList(periodo: any, page=1, perPage=20): Observable<PaginatedResponse<ClienteItem>> {
    const params = new HttpParams().set('periodo', periodo).set('page', page).set('perPage', perPage);
    return this.http.get<PaginatedResponse<ClienteItem>>(`${environment.apiURL}/clientes/dashboard/clientes-fechados`, { params });
  }
  getEventosMarcadosList(periodo: any, page=1, perPage=20): Observable<PaginatedResponse<EventoItem>> {
    const params = new HttpParams().set('periodo', periodo).set('page', page).set('perPage', perPage);
    return this.http.get<PaginatedResponse<EventoItem>>(`${environment.apiURL}/clientes/dashboard/eventos-marcados`, { params });
  }
}
