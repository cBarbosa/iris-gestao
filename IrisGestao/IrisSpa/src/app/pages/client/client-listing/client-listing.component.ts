import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { Utils } from 'src/app/shared/utils';
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
	noRestults = false;
	first = 0;
	rows = 10;
	public clientEntries: any[];
	dropdownTipoCliente: any;
	tiposCliente = [
		{
			label: 'Tipo do cliente',
			value: null,
		},
	];

	filterText: string = '';

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
			this.getClientsPage(page, this.filterText);
		}
	}

	getClientsPage(page = 1, filter?: string): void {
		this.isLoadingClients = true;
		const clients = this.clienteService
			.getClients(this.rows, page, filter)
			?.pipe(first())
			.subscribe({
				next: (event: any) => {
					if (event.success === true) {
						this.totalClientCount = event.data.totalCount;
						if (this.totalClientCount <= 0) this.noRestults = true;
						else this.noRestults = false;

						this.clientEntries = event.data.items.map((cliente: any) => {
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
					} else {
						this.totalClientCount = 0;
						this.noRestults = true;
						this.clientEntries = [];
					}
					this.isLoadingClients = false;
				},
				error: () => {
					this.totalClientCount = 0;
					this.clientEntries = [];
					this.noRestults = true;
					this.isLoadingClients = false;
				},
			});
	}

	filterClients = (e: Event) => {
		console.log(e);
		const filter: string = e.toString();

		this.getClientsPage(1, filter);
	};

	filterClientDebounce: Function = Utils.debounce(this.filterClients, 1000);

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
