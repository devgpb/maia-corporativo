import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class RelatorioPessoalService {

  constructor(private http: HttpClient) { }

  public getPedidosRealizados (id: string): Observable<any>{

		return this.http.get<any>(`${environment.apiURL}/relatorio/usuario/realizados/${id}`)
	}
}
