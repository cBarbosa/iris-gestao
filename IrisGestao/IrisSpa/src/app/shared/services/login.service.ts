import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login, Usuario } from 'src/app/shared/models';

const CHAVE_USER: string = "usuarioLogado";
const CHAVE_TOKEN: string = "accessToken";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  public get usuarioLogado(): Usuario {
    let user = localStorage[CHAVE_USER];
    return (user ? JSON.parse(localStorage[CHAVE_USER]) : null);
  }

  public set usuarioLogado(usuario: Usuario)  {
    localStorage[CHAVE_USER] = JSON.stringify(usuario);
  }

  public get token(): string {
    let token = localStorage[CHAVE_TOKEN];
    return (token ? JSON.parse(localStorage[CHAVE_TOKEN]) : null);
  }

  public set token(accessToken: string)  {
    localStorage[CHAVE_TOKEN] = JSON.stringify(accessToken);
  }

  logout() {
    delete localStorage[CHAVE_USER];
    delete localStorage[CHAVE_TOKEN];
  }

  login(login: Login) : Observable<Usuario | null>  {
console.debug('login', login);
    let user = new Usuario('xbrown@gmail.com', 'Charles', 'Tester', 'Senha');

    return of(user);
  }
}
