import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IPedido } from 'src/app/interfaces/IPedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  public getPedidos (): Observable<IPedido[]>{

		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos`)
    // return true
	}
}
