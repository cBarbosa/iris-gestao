import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../shared/models';
import { LoginService } from '../../shared/services';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	loggedUser: Usuario = this.loginService.usuarioLogado;

	constructor(private loginService: LoginService, private router: Router) {}

	sair(): void {
		this.loginService.logout();
		this.router.navigate(['/login']);
	}
}
