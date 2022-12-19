import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { ClientService } from 'src/app/shared/services';

@Component({
	selector: 'app-client-listing',
	templateUrl: './client-listing.component.html',
	styleUrls: ['./client-listing.component.scss'],
})
export class ClientListingComponent {
	statusOptions = [
		{ label: 'Ativo', status: 'ativo' },
		{ label: 'Inativo', status: 'inativo' },
	];

	constructor(private router: Router, private clientService: ClientService) {}

	clients:any = [];

	ngOnInit() {
		const clients = this.clientService
			.getClients()
			?.pipe(first())
			.subscribe((event: any) => {
				this.clients = [];

				event.forEach((client: any) => {
					console.log(client);
					this.clients.push({
						name: client?.nome,
						cpf_cnpj: '72.165.630/0001-27',
						birthday: client?.dataNascimento
							? new Date(client?.dataNascimento).toLocaleDateString('pt-BR')
							: new Date().toLocaleDateString('pt-BR'),
						client_type: 'Locatário',
						status: 'ativo',
						action: '',
					});
				});
			});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
