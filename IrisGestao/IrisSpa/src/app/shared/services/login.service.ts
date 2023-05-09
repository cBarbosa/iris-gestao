import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Login, Usuario } from 'src/app/shared/models';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

const CHAVE_USER: string = 'usuarioLogado';
const CHAVE_TOKEN: string = 'accessToken';

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	constructor(private http: HttpClient) {}

	public get usuarioLogado(): Usuario {
		let user = localStorage[CHAVE_USER];
		return user ? JSON.parse(localStorage[CHAVE_USER]) : null;
	}

	public set usuarioLogado(usuario: Usuario) {
		localStorage[CHAVE_USER] = JSON.stringify(usuario);
	}

	public get token(): string {
		let token = localStorage[CHAVE_TOKEN];
		return token ? JSON.parse(localStorage[CHAVE_TOKEN]) : null;
	}

	public set token(accessToken: string) {
		localStorage[CHAVE_TOKEN] = JSON.stringify(accessToken);
	}

	logout() {
		delete localStorage[CHAVE_USER];
		delete localStorage[CHAVE_TOKEN];
	}

	login(login: Login): Observable<Usuario | null> {
		let user = new Usuario(1, 'email@spam.com', 'Charles', 'Tester');

		return of(user);
	}

	postValidate(): Observable<ApiResponse> {
		const authObject = {
			token: this.token,
		};

		return this.http
			.post<ApiResponse>(`${env.config.apiUrl}auth/validate`, authObject)
			.pipe(
				map((response): ApiResponse => {
					console.debug('postValidate response', response);
					if (!response.success)
						console.error(`postValidate: ${response.message}`);
					return response;
				})
			);
	}

	getAuthUser(): Observable<ApiResponse> {
		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: `Bearer ${this.token}`,
			}),
		};

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}auth`, httpOptions)
			.pipe(
				map((response): ApiResponse => {
					console.debug('getAuthUser response', response);
					if (!response.success)
						console.error(`getAuthUser: ${response.message}`);
					return response;
				})
			);
	}
}
