import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(private http: HttpClient) { }

  public getEventos (): Observable<any[]>{
		return this.http.get<any[]>(`${environment.apiURL}/calendario/eventos`)
	}
}
