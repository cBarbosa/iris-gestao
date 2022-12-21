import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { ClientService } from 'src/app/shared/services/client.service';

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

	totalClientCount: number;
	isLoadingClients = false;
	first = 0;
	rows = 10;
	public clientEntries: any[];
	constructor(private router: Router, private clientService: ClientService) {}

	ngOnInit():void {
		
	}

	loadClientsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			this.isLoadingClients = true;
			const page = Math.floor(event.first / this.rows) + 1;
			this.getClientsPage(page);
		}
	}

	getClientsPage(page = 1): void {
		const clients = this.clientService
			.getClients()
			?.pipe(first())
			.subscribe((event: any) => {
				this.clientEntries = [];
				this.isLoadingClients = true;
				event.items.forEach((cliente: any) => {
					//console.log('Cliente >> ' + JSON.stringify(cliente));
					this.clientEntries.push({
						name: cliente.nome,
						cpf_cnpj: cliente.cpfCnpj,
						birthday: cliente.dataNascimento
							? new Date(cliente.dataNascimento)
							: new Date(),
						client_type: cliente.idTipoClienteNavigation.nome,
						status: 'ativo',
						action: '',
					});
				});
				this.isLoadingClients = false;
			});
	}

	setClientEntries({ items }: any) {
		this.clientEntries = items.map((item: any) => {
			return {
				name: 'Courtney Henry',
				cpf_cnpj: '72.165.630/0001-27',
				birthday: new Date(),
				client_type: 'Locatário',
				status: 'inativo',
				action: '',
			};
		});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}