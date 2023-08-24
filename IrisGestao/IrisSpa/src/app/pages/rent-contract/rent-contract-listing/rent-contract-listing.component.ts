import { DatePipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { CommonService } from 'src/app/shared/services';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-rent-contract-listing',
	templateUrl: './rent-contract-listing.component.html',
	styleUrls: ['./rent-contract-listing.component.scss'],
})
export class RentContractListingComponent {
	totalContractCount: number;
	isLoadingContracts = false;
	first = 0;
	rows = 10;
	pageIndex = 1;
	noRestults = false;
	contractEntries: any[];

	tableMenu: MenuItem[];
	focusedContract: any;

	onInputDate: Function;
	onBlurDate: Function;

	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	cardPipes: Record<string, PipeTransform>;

	basesReajuste = [
		{
			label: 'Índice de reajuste',
			value: null,
		},
	];
	tiposImovel = [
		{
			label: 'Tipo de imóvel',
			value: null,
		},
	];

	// vencimentos = [
	// 	{
	// 		label: 'Vencimento',
	// 		value: null,
	// 	},
	// 	{
	// 		label: 'Hoje',
	// 		value: null,
	// 	},
	// 	{
	// 		label: 'Esta semana',
	// 		value: null,
	// 	},
	// 	{
	// 		label: 'Este mês',
	// 		value: null,
	// 	},
	// 	{
	// 		label: 'Este ano',
	// 		value: null,
	// 	},
	// 	{
	// 		label: 'Próximo ano',
	// 		value: null,
	// 	},
	// ];

	filterText: string = '';
	filterBase: number;
	filterType: number;
	filterStart: string | null = null;
	filterEnd: string | null = null;	
	filterPeriodo: Date[];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private contractService: RentContractService,
		private commonService: CommonService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit(): void {
		const routePageIndex =
			this.activatedRoute.snapshot.paramMap.get('pageIndex') ?? 1;
		this.pageIndex = +routePageIndex;

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear-10, 0, 1), new Date(currYear+10, 11, 1)];


		if (this.isMobile) this.setContractsEntries();

		this.cardPipes = {
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
		};

		this.commonService
			.getUnitType()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.tiposImovel.push(
							...e.data.map((item: any) => {
								return {
									label: item.nome,
									value: item.id,
								};
							})
						);
					} else console.error(e.message);
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.commonService
			.getReadjustment()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.basesReajuste.push(
							...e.data.map((item: any) => {
								return {
									label: item.nome,
									value: item.id,
								};
							})
						);
					} else console.error(e.message);
				},
				error: (err) => {
					console.error(err);
				},
			});
	}

	loadContractsPage(event: LazyLoadEvent) {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			// this.getContractPage(page, this.filterText);
			this.filterContracts(undefined, page);
			this.scrollTop();
		}
	}

	setContractsEntries(
		page = 1,
		numeroContrato?: number,
		idBaseReajuste?: number,
		idTipoImovel?: number,
		dthInicioVigencia?: string,
		dthFimVigencia?: string
	): Promise<any> {
		this.contractEntries = [];

		return this.getContractPage(
			page,
			numeroContrato,
			idBaseReajuste,
			idTipoImovel,
			dthInicioVigencia,
			dthFimVigencia
		)
			.then((content) => {
				this.totalContractCount = content.totalCount;
				if (this.totalContractCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.contractEntries = content.data;
			})
			.catch((err) => {
				this.totalContractCount = 0;
				this.noRestults = true;
			});
	}

	loadContractEntries(): void {
		const page = Math.ceil(this.contractEntries.length / this.rows) + 1;

		this.filterContracts(undefined, page, true)
			.then((content) => {
				this.totalContractCount = content.totalCount;
				if (this.totalContractCount <= 0) this.noRestults = true;
				else this.noRestults = false;

				this.contractEntries = [...this.contractEntries, ...content.data];
			})
			.catch((err) => {
				this.totalContractCount = 0;
				this.noRestults = true;
			});
	}

	getContractPage(
		page = 1,
		numeroContrato?: number,
		idBaseReajuste?: number,
		idTipoImovel?: number,
		dthInicioVigencia?: string,
		dthFimVigencia?: string
	): Promise<any> {
		this.isLoadingContracts = true;

		return new Promise((res, rej) => {
			this.contractService
				.getContracts(
					this.rows,
					page,
					idTipoImovel,
					idBaseReajuste,
					dthInicioVigencia,
					dthFimVigencia,
					numeroContrato
				)
				?.pipe(first())
				.subscribe({
					next: (event: any) => {
						if (event.success === true) {
							console.log(event.data);

							res({
								totalCount: event.data.totalCount,
								data: event.data.items.map((contrato: any) => {
									return {
										numeroContrato: contrato.numeroContrato,
										locatario: contrato.cliente.nome,
										unidade: 'UNIDADE',
										dataInicioContrato: contrato.dataInicioContrato
											? new Date(contrato.dataInicioContrato)
											: null,
										proxAjuste: contrato.periodicidadeReajuste,
										dataFimContrato: contrato.dataFimContrato
											? new Date(contrato.dataFimContrato)
											: null,
										baseReajuste: contrato.indiceReajuste?.nome,
										action: '',
										guidReferencia: contrato.guidReferencia,
									};
								}),
							});
						} else {
							rej(null);
						}
						this.isLoadingContracts = false;
					},
					error: () => {
						this.isLoadingContracts = false;
						rej(null);
					},
				});
		});
	}

	filterContracts = (
		e?: Event,
		page: number = 1,
		stack: boolean = false
	): Promise<any> => {
		console.log('Filtro >> ' + JSON.stringify(this.filterPeriodo));
		if ((this.filterPeriodo?.[0], this.filterPeriodo?.[1])) {
			const startDate = new Date(this.filterPeriodo[0]);
			startDate.setDate(1);
			const endDate = new Date(this.filterPeriodo[1]);
			endDate.setDate(1);
		
		//const startDate = this.filterStart && new Date(this.filterStart);
		//const endDate = this.filterEnd && new Date(this.filterEnd);

		const startISODate = !isNaN(Date.parse(startDate + ''))
			? (startDate as Date).toISOString()
			: undefined;
		const endISODate = !isNaN(Date.parse(endDate + ''))
			? (endDate as Date).toISOString()
			: undefined;

			if (stack)
				return this.getContractPage(
					page,
					+this.filterText,
					this.filterBase,
					this.filterType,
					startISODate,
					endISODate
				);
			else
				return this.setContractsEntries(
					page,
					+this.filterText,
					this.filterBase,
					this.filterType,
					startISODate,
					endISODate
				);
			}
			else{
				return this.getContractPage(
					page,
					+this.filterText,
					this.filterBase,
					this.filterType,
					'',
					''
				);
			}
	};

	filterContractsDebounce: Function = Utils.debounce(
		this.filterContracts,
		1000
	);

	openFilters() {
		this.displayMobileFilters = true;
	}

	setCurrentContract(item: any): void {
		this.focusedContract = item;
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
