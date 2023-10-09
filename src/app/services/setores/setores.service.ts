import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ISetor } from 'src/app/interfaces/ISetor';


@Injectable({
  providedIn: 'root'
})
export class SetoresService {

  constructor(private http: HttpClient) { }

  public getSetores (): Observable<ISetor[]>{

		return this.http.get<ISetor[]>(`${environment.apiURL}/setores`)
    // return true
	}

  public salvarSetor (nome:string): Observable<ISetor>{
		return this.http.post<ISetor>(`${environment.apiURL}/setores`, {nome})
    // return true
	}

  public apagarSetor(ref:string) : Observable<boolean>{
		return this.http.delete<boolean>(`${environment.apiURL}/setores/${ref}`)
  }
}
