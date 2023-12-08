import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class RelatoriosGerenciaisService {

  constructor(private http: HttpClient) { }

  public getPedidosRealizados (id: string): Observable<any>{

		return this.http.get<any>(`${environment.apiURL}/relatorio/usuario/realizados/${id}`)
	}

  getRelatorioGeral(dataInicio: string, dataFim: string): Observable<any>{
    let params = new HttpParams()
    .append("dataInicio", dataInicio)
    .append("dataFim", dataFim)


    return this.http.get(`${environment.apiURL}/relatorios/geral`);
  }

  getRelatorioRSA(dataInicio: string, dataFim: string): Observable<any> {
    let params = new HttpParams()
			.append("dataInicio", dataInicio)
			.append("dataFim", dataFim)


    return this.http.get(`${environment.apiURL}/relatorios/rsa`, { params });
  }
}
