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

	constructor(private router: Router, private clientService: ClientService) {}

	clientEntries = [
		{
			nome: 'Courtney Henry',
			cpf_cnpj: '72.165.630/0001-27',
			dataNascimento: new Date(),
			client_type: 'Locatário',
			status: 'ativo',
			action: '',
		},
		{
			name: 'Courtney Henry',
			cpf_cnpj: '72.165.630/0001-27',
			birthday: new Date(),
			client_type: 'Locatário',
			status: 'inativo',
			action: '',
		},
	];

	ngOnInit() {
		const clients = this.clientService
			.getClients()
			?.pipe(first())
			.subscribe((event: any) => {
				console.log('>>>>>>>>>>>>>>>>>>>>', event);

				this.clientEntries = [];

				event.forEach((client: any) => {
					console.log(client);
					this.clientEntries.push({
						name: client.nome,
						cpf_cnpj: '72165630000127',
						birthday: client.dataNascimento
							? new Date(client.dataNascimento)
							: new Date(),
						client_type: 'Locatário',
						status: 'ativo',
						action: '',
					});
				});
			});
	}

	loadClientsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			this.isLoadingClients = true;
			const page = Math.floor(event.first / this.rows) + 1;
			this.getClientsPage(page);
		}
	}

	getClientsPage(page = 1): void {
		this.clientService
			.getClients(this.rows, page)
			?.pipe(first())
			.subscribe((event: any) => {
				if (event) {
					this.totalClientCount = event.totalCount;
					this.setClientEntries(event);
				}
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
