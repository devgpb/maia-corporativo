import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IPedido } from 'src/app/interfaces/IPedido';
import { INovoPedido } from 'src/app/interfaces/INovoPedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  public getPedidos (): Observable<IPedido[]>{
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos`)
	}

  public getProcessando (): Observable<IPedido[]>{
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/processando`)
	}

  public getInstalar (): Observable<IPedido[]>{
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/instalar`)
	}

  public getFinalizado(): Observable<IPedido[]>{
		return this.http.get<IPedido[]>(`${environment.apiURL}/pedidos/finalizado`)
	}

  public avancarPedido(idPedido: any): Observable<IPedido[]>{
		return this.http.post<IPedido[]>(`${environment.apiURL}/pedidos/avancar/${idPedido}`,{})
	}

  public updatePedido(idPedido: any,pedido: IPedido): Observable<IPedido[]>{
		return this.http.put<IPedido[]>(`${environment.apiURL}/pedidos/${idPedido}`, pedido)
	}

  public retrocederPedido(idPedido: any): Observable<IPedido[]>{
		return this.http.post<IPedido[]>(`${environment.apiURL}/pedidos/retroceder/${idPedido}`,{})
	}

  public deletePedidos (idPedido:string): Observable<boolean>{
    return this.http.delete<boolean>(`${environment.apiURL}/pedidos/${idPedido}`)
	}

  public setPedido (pedido: INovoPedido): Observable<INovoPedido>{
		return this.http.post<INovoPedido>(`${environment.apiURL}/pedidos`,  pedido )
	}
}
