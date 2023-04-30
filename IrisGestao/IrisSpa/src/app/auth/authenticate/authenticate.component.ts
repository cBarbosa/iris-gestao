import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { LoginService } from 'src/app/shared/services';
@Component({
	selector: 'app-authenticate',
	templateUrl: './authenticate.component.html',
	styleUrls: ['./authenticate.component.scss'],
})
export class AuthenticateComponent implements OnInit {
	accessToken: string | null = '';
	error: string | null = '';
	errorDescription: string | null = '';

	constructor(
		private pLocation: PlatformLocation,
		private loginService: LoginService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.accessToken = new URLSearchParams(this.pLocation.hash).get(
			'#id_token'
		);

		if(!this.accessToken) {
			this.accessToken = new URLSearchParams(this.pLocation.hash).get(
				'#access_token'
			);
		};

		this.error = new URLSearchParams(this.pLocation.hash).get('#error');

		if (this.accessToken) {
			this.validaAutenticacao();
		}

		if (this.error) {
			this.redirecionaLogin();
		}
	}

	validaAutenticacao(): void {
		this.loginService.token = this.accessToken ?? '';
		this.loginService
			.getAuthUser()
			.pipe(first())
			.subscribe(
				(result: ApiResponse) => {
					if (!result.success) {
						this.router.navigate(['/login'], {
							queryParams: { error: `Proibido o acesso este recurso.` },
						});
					}
					this.loginService.usuarioLogado = result.data;
					this.router.navigate(['/']);
				},
				(error: any) => {
					console.error(error);
					this.redirecionaLogin();
				}
			);
	}

	redirecionaLogin(): void {
		this.errorDescription = new URLSearchParams(this.pLocation.hash).get(
			'error_description'
		);
		this.router.navigate(['/login'], {
			queryParams: { error: this.errorDescription },
		});
	}
}
