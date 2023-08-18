import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { RentContractService, ReportService, ResponsiveService } from 'src/app/shared/services';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-report-costs',
  templateUrl: './report-costs.component.html',
  styleUrls: ['./report-costs.component.scss']
})
export class ReportCostsComponent {
  	@ViewChild('reportToPdf', {read: ElementRef}) childElement: ElementRef<HTMLElement>;
  
	isLoading: boolean = true;
	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
  	totalRecords:number = 0;
  	resultEntries: any[];

	first = 0;
	rows = 10;

	filterImovel: number;
	filterTipoImovel: number;
	filterLocador: number;
	filterLocatario: number;
	filterStatus: boolean;
	filterPeriodo: Date[];

  	opcoesImovel = [
		{
			label: 'Todos Imóveis',
			value: null,
		},
	];
	opcoesTipoImovel = [
		{
			label: 'Tipo Imóvel',
			value: null,
		},
	];
	opcoesLocador = [
		{
			label: 'Locador',
			value: null,
		},
	];
	opcoesLocatario = [
		{
			label: 'Locatário',
			value: null,
		},
	];
	opcoesStatus = [
		{
			label: 'Status',
			value: null,
		},
	];
  	items: MenuItem[] = [
		{
			label: 'Opções',
			items: [
				{
					label: 'PDF',
					icon: 'pi pi-file-pdf',
					command: () => {
						this.exportarPdf();
					}
				},
				{
					label: 'Excel',
					icon: 'pi pi-file-excel',
					command: () => {
						this.exportarExcell();
					}
				}
			]
		}
	];

	totalSum:
		| {
				totalTitulo: number;
				totalValorPagoPagar: number;
		  }
		| undefined;

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private reportService: ReportService,
		private rentContract: RentContractService
	) { };

  	ngOnInit(): void {

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.init();
	};

  	init():void {
		const currYear = new Date().getFullYear();
		this.filterPeriodo = [new Date(currYear, 0, 1), new Date(currYear, 11, 1)];

		this.filterResult();
		this.getOwnersListData();
		this.getUnitTypesData();
		this.getPropertiesListData();
		this.getRentersListData();
	};

  	openFilters() {
		this.displayMobileFilters = true;
	}

  	filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		this.isLoading = true;

		if(this.filterPeriodo?.[0], this.filterPeriodo?.[1]) {

			const startDate = new Date(this.filterPeriodo[0]);
			startDate.setDate(1);
			const endDate = new Date(this.filterPeriodo[1]);
			endDate.setDate(1);

			const startDateString = startDate.toISOString().split('T')[0];
			const endDateString = endDate.toISOString().split('T')[0];

			const idLocador = this.filterLocador ?? null;
			const idLocatario = this.filterLocatario ?? null;
			const idTipo = this.filterTipoImovel ?? null;
			const idImovel = this.filterImovel ?? null;
			const status = this.filterStatus ?? null;

			this.getData(startDateString, endDateString, idImovel, status, idTipo, idLocatario, idLocador);
		}
	};

  	filterResultDebounce: Function = Utils.debounce(this.filterResult, 1000);

	exportarPdf(): void {
		Utils.saveReportAsPdf(this.childElement.nativeElement, 'costs', 'Financeiro - Despesas');
	};

  	exportarExcell(): void {
		Utils.saveReportAsExcell(this.childElement.nativeElement, 'costs', 'Financeiro - Despesas');
	};

  	loadResultPage(event: LazyLoadEvent): void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.filterResult(undefined, page);
			this.scrollTop();
		}
	};

  	getData(
		startDateString: string,
		endDateString: string,
		imovelId?: number,
		status?: boolean,
		tipoImovelId?: number,
		locatarioId?: number,
		locadorId?: number) : void {

		this.isLoading = true;

		this.reportService
			.getCosts(startDateString, endDateString, imovelId, status, tipoImovelId, locatarioId, locadorId)
			.pipe(first())
			.subscribe({
				next: (data) => {
					if (data) {
						this.resultEntries = data;
						this.totalRecords = this.resultEntries.length;

						this.totalSum = data.reduce(
							(acc, entry) => {
								acc.totalTitulo += entry.valorTotalTitulo;
								acc.totalValorPagoPagar += entry.valorRealPago ?? entry.valor;

								return acc;
							},
							{
								totalTitulo: 0,
								totalValorPagoPagar: 0
							}
						);
					}
				},
				error: () => {
					console.error(console.error);
				},
				complete : () => this.isLoading = false,
			});
	
	};

  	getOwnersListData() {
		this.rentContract
			.getActiveOwners()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesLocatario.push(
							...e.data.map((item: any) => {
								return {
									label: this.truncateChar(item.nome),
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
	};

	getPropertiesListData() {
		this.rentContract
			.getActiveProperties()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesImovel.push(
							...e.data.map((item: any) => {
								return {
									label: this.truncateChar(item.nome),
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
	};

	getUnitTypesData() {
		this.rentContract
			.getActiveUnitType()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesTipoImovel.push(
							...e.data.map((item: any) => {
								return {
									label: this.truncateChar(item.nome),
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
	};

	getRentersListData() {
		this.rentContract
			.getActiveRenters()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesLocador.push(
							...e.data.map((item: any) => {
								return {
									label: this.truncateChar(item.nome),
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
	};

	truncateChar(text: string): string {
		const charlimit = 48;
		if (!text || text.length <= charlimit) {
			return text;
		}

		const without_html = text.replace(/<(?:.|\n)*?>/gm, '');
		const shortened = without_html.substring(0, charlimit) + '...';
		return shortened;
	};

  	scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	};

}
