import { DatePipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { first } from 'rxjs';
import { CpfCnpjPipe } from 'src/app/shared/pipes/cpf-cnpj.pipe';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';
import { ClienteService } from '../../../shared/services/cliente.service';
import { DominiosService } from '../../../shared/services/dominios.service';
import { LoginService } from 'src/app/shared/services';

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

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	cardPipes: Record<string, PipeTransform>;

	isFormEditable:boolean = true;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private clienteService: ClienteService,
		private dominiosService: DominiosService,
		private responsiveService: ResponsiveService,
		private loginService: LoginService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		this.getTiposCliente();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		if (this.isMobile) this.setClientEntries();

		this.cardPipes = {
			cpfcnpj: new CpfCnpjPipe(),
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
		};

		this.isFormEditable = this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'analista';
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
			this.setClientEntries(page, this.filterText, this.filterType);
			this.scrollTop();
		}
	}

	setClientEntries(page = 1, filter?: string, typeId?: number): void {
		this.clientEntries = [];

		this.getClientsPage(page, filter, typeId)
			.then((content) => {
				this.totalClientCount = content.totalCount;
				if (this.totalClientCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.clientEntries = content.data;
			})
			.catch((err) => {
				this.totalClientCount = 0;
				this.noRestults = true;
			});
	}

	loadClientEntries(): void {
		const page = Math.ceil(this.clientEntries.length / this.rows) + 1;

		this.getClientsPage(page, this.filterText, this.filterType)
			.then((content) => {
				this.totalClientCount = content.totalCount;
				if (this.totalClientCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.clientEntries = [...this.clientEntries, ...content.data];
			})
			.catch((err) => {
				this.totalClientCount = 0;
				this.noRestults = true;
			});
	}

	getClientsPage(page = 1, filter?: string, typeId?: number): Promise<any> {
		this.isLoadingClients = true;

		return new Promise((res, rej) => {
			this.clienteService
				.getClients(this.rows, page, filter, typeId)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((cliente: any) => {
									// console.log('Cliente >> ', cliente);
									return {
										name: cliente.nome,
										cpf_cnpj: cliente.cpfCnpj,
										birthday: cliente.dataNascimento
											? new Date(cliente.dataNascimento)
											: null,
										// client_type: cliente.idTipoClienteNavigation.nome,
										status: 'ativo',
										hasImovel: cliente.totalImoveis > 0 ? true : false,
										hasContrato:
											cliente.totalContratosAluguel > 0 ? true : false,
										action: '',
										guidReferencia: cliente.guidReferencia,
									};
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingClients = false;
					},
					error: () => {
						this.isLoadingClients = false;
						rej(null);
					},
				});
		});
	}

	filterClients = (e: Event) => {
		console.log(e);

		this.setClientEntries(1, this.filterText, this.filterType);
	};

	filterClientDebounce: Function = Utils.debounce(this.filterClients, 1000);

	openFilters() {
		this.displayMobileFilters = true;
	}

	closeFilters() {
		this.displayMobileFilters = false;
	}

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
