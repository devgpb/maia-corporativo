import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IEvento } from 'src/app/interfaces/IEvento';

@Injectable({
  providedIn: 'root'
})
export class EventosServce {

  constructor(private http: HttpClient) { }

  public setEvento (evento : IEvento): Observable<any>{
    // const body = new FormData()
    // body.append("nome", evento.nome);
    // body.append("data", evento.data.toString());
    // body.append("detalhes", evento.detalhes);


		return this.http.post<any>(`${environment.apiURL}/eventos/novo`, evento )
	}
}
