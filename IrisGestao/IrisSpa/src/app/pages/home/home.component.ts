import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../shared/models';
import { LoginService } from '../../shared/services';
import { LinkedProperty } from 'src/app/shared/components/link-property/link-property.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	loggedUser: Usuario = this.loginService.usuarioLogado;

	filesSelected: File[];

	// logged user control
	isFormEditable:boolean = this.loginService.checkAllowedRoleItem(['coordenação', 'diretoria']);

	constructor(private loginService: LoginService, private router: Router) {}

	sair(): void {
		this.loginService.logout();
		this.router.navigate(['/login']);
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
