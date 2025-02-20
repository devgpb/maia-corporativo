import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";


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

}
