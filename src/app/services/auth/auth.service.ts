// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuario: IUser = {
    idUsuario: "",
    dataNascimento: new Date(),
    idSetor: 0,
    email: "",
    cargo: "COLABORADOR"
  };

  constructor(private http: HttpClient, private router: Router,) {
  }

  login(username: string, password: string ): Observable<any> {
    let credentials = {email: username,senha: password}
    return this.http.post<any>(`${environment.apiURL}/login`, credentials).pipe(
      tap(response => {
        this.usuario = response.userData
        this.setCookie('token', response.token, 7);
      })
    );
  }

  getUser():IUser{
    return this.usuario
  }

  private setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
    console.log(document.cookie)
  }

  getAuthToken(): string | null {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (const cookie of cookieArray) {
      let c = cookie;
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  logout() {
    // Remova o token do cookie ao fazer logout
    this.setCookie('token', '', -1);
		this.router.navigate(["login"]);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

}
