import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginService } from "src/app/shared/services";

@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private loginService: LoginService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.loginService.token;
        const user = this.loginService.usuarioLogado;
        const isLoggedIn = user && token;

        if(isLoggedIn)   {
            req = req.clone({ setHeaders: {Authorization: `Bearer ${this.loginService.token}`}});
        }

        return next.handle(req);
    }
}
