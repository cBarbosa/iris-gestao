import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
	pageIndex = 1;
	public clientEntries: any[];
	dropdownTipoCliente: any;
	tiposCliente = [
		{
			label: 'Todos os tipos de cliente',
			value: null,
		},
	];

	filterText: string;
	filterType: number;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private clienteService: ClienteService,
		private dominiosService: DominiosService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

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
			const page = Math.floor(event.first / this.rows) + 1;
			this.getClientsPage(page, this.filterText);
			this.scrollTop();
		}
	}

	getClientsPage(page = 1, filter?: string, typeId?: number): void {
		this.isLoadingClients = true;
		this.clientEntries = [];

		const clients = this.clienteService
			.getClients(this.rows, page, filter, typeId)
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

		this.getClientsPage(1, this.filterText, this.filterType);
	};

	filterClientDebounce: Function = Utils.debounce(this.filterClients, 1000);

	scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
