import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private loginService: LoginService,
    private router: Router
    ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const usuarioLogado = this.loginService.usuarioLogado;

    let url = state.url;

    if(usuarioLogado) {
      if(route.data?.['role'] && route.data?.['role'].indexOf(usuarioLogado.jobTitle) === -1) {
        // verifica o perfil do usuário está no perfil da rota
        this.router.navigate(['/login'], {queryParams: {error: `Proibido o acesso à URL ${url}`}});
        return false;
      }
      return true;
    }

    this.router.navigate(['/login'], {queryParams: {error: `Deve fazer login para acessar a URL ${url}`}});

    return false;
  }
  
}
