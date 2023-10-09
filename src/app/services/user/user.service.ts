import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IUser } from 'src/app/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public atualizarUser(dados: any, idUser: string): Observable<boolean>{
		return this.http.put<boolean>(`${environment.apiURL}/usuarios/${idUser}`,dados)
	}
}
