import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { LoginService } from "src/app/shared/services";

@Injectable({
    providedIn: 'root'
  })
export class ErrorInterceptor implements HttpInterceptor    {

    constructor(private loginService: LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(err => {

			if ([401, 403].includes(err.status) && this.loginService.usuarioLogado) {
					// auto logout
					this.loginService.logout();
			}

			const error = err.error?.message || err.statusText;
			console.error(err);
			return throwError(() => new Error(err));
		}))
    }

    
}
