import { Injectable } from "@angular/core";
import { LoginService } from "./services/login.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private loginService: LoginService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.loginService.token;

        // token existe
        if(token)   {
            const authRequest = req.clone({ setHeaders: {'Authorization': `Bearer ${this.loginService.token}`}});

            return next.handle(authRequest);
        }

        return next.handle(req);
    }
}
