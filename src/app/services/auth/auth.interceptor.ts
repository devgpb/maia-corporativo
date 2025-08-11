import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtenha o token JWT de onde ele está armazenado (por exemplo, LocalStorage)
    const jwtToken = this.authService.getAuthToken();
    request = request.clone({
      withCredentials: true
    })

    if (jwtToken) {
      // Clone a requisição e substitua o header original por um que inclui o JWT
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        },
        withCredentials: true
      });
    }

    // Continue com a requisição modificada ou original
    return next.handle(request);
  }
}
