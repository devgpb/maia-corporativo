import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IReferencia } from 'src/app/interfaces/IReferencia';

@Injectable({
  providedIn: 'root'
})
export class ReferenciasService {

  constructor(private http: HttpClient) { }

  public getReferencias (): Observable<IReferencia[]>{

		return this.http.get<IReferencia[]>(`${environment.apiURL}/referencias`)
    // return true
	}

  public salvarReferencia (nome:string): Observable<IReferencia>{
		return this.http.post<IReferencia>(`${environment.apiURL}/referencias`, {nome})
    // return true
	}

  public apagarReferencia(ref:string) : Observable<boolean>{
		return this.http.delete<boolean>(`${environment.apiURL}/referencias/${ref}`)
  }
}
