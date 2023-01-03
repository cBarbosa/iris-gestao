import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { ClienteService } from '../../../shared/services/cliente.service';
import { DominiosService } from '../../../shared/services/dominios.service';

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
	dropdownTipoCliente: any;
	tiposCliente = [
		{
			label: 'Selecione',
			value: null,
		},
	];

	constructor(
		private router: Router,
		private clienteService: ClienteService,
		private dominiosService: DominiosService
	) {}

	ngOnInit(): void {
		this.getTiposCliente();
	}

	getTiposCliente(): void {
		const tipoCliente = this.dominiosService
			.getTipoCliente()
			.subscribe((event) => {
				//console.log('getTiposCliente >> TipoCliente >> ' + JSON.stringify(event));
				this.dropdownTipoCliente = event;
				this.dropdownTipoCliente.data.forEach((tipo: any) => {
					this.tiposCliente.push({
						label: tipo.nome,
						value: tipo.id,
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
		const clients = this.clienteService
			.getClients(this.rows, page)
			?.pipe(first())
			.subscribe((event: any) => {
				this.totalClientCount = event.totalCount;
				this.clientEntries = event.items.map((cliente: any) => {
					// console.log('Cliente >> ', cliente);
					return {
						name: cliente.nome,
						cpf_cnpj: cliente.cpfCnpj,
						birthday: cliente.dataNascimento
							? new Date(cliente.dataNascimento)
							: new Date(),
						// client_type: cliente.idTipoClienteNavigation.nome,
						status: 'ativo',
						action: '',
						guidReferencia: cliente.guidReferencia,
					};
				});
				this.isLoadingClients = false;
			});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
