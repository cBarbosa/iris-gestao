import { CurrencyPipe } from '@angular/common';
import { Component, PipeTransform, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { AreaPipe } from 'src/app/shared/pipes/area.pipe';
import { CommonService, RentContractService, ReportService } from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-report-leased-area',
	templateUrl: './report-leased-area.component.html',
	styleUrls: ['./report-leased-area.component.scss'],
})
export class ReportLeasedAreaComponent {
	@ViewChild('reportToPdf', {read: ElementRef}) childElement: ElementRef<HTMLElement>;
	
	isLoading: boolean = true;
	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	totalAreaCount: number;
	noRestults: boolean = false;
	resultEntries: any[];
	cardPipes: Record<string, PipeTransform>;

	totalSum:
		| {
				area: number;
				areaUtil: number;
				areaHabitese: number;
				aluguelContratado: number;
				aluguelPotencial: number;
		  }
		| undefined;

	first = 0;
	rows = 10;
	pageIndex = 1;

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

	filterImovel: number;
	filterTipoImovel: number;
	filterLocador: number;
	filterLocatario: number;
	filterStatus: boolean;

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

	constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private reportLeasedAreaService: ReportService,
		private rentContract: RentContractService,
		private commonService: CommonService
	) { };

	ngOnInit(): void {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			area: new AreaPipe(),
			currency: new CurrencyPipe('pt-BR', 'R$'),
		};

		this.init();
	};

	init():void {
		this.filterResult();
		this.getOwnersListData();
		this.getUnitTypesData();
		this.getPropertiesListData();
	};



	filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		this.isLoading = true;

		const idLocador = this.filterLocador ?? null;
		const idTipo = this.filterTipoImovel ?? null;
		const idImovel = this.filterImovel ?? null;
		const status = this.filterStatus ?? null;

		this.getData(idImovel, status, idTipo, undefined, idLocador);
	};

	loadResultPage(event: LazyLoadEvent): void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.filterResult(undefined, page);
			this.scrollTop();
		}
	}

	filterResultDebounce: Function = Utils.debounce(this.filterResult, 1000);

	openFilters() {
		this.displayMobileFilters = true;
	}

	scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	}

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
  };
  
	exportarPdf(): void {
		Utils.saveReportAsPdf(this.childElement.nativeElement, 'area-locada', 'Relatório área locada m²');
	};

	exportarExcell(): void {
		Utils.saveReportAsExcell(this.childElement.nativeElement, 'area-locada', 'Relatório área locada m²');
	};

	getData(
		imovelId?: number,
		status?: boolean,
		tipoImovelId?: number,
		locatarioId?: number,
		locadorId?: number):void {

		this.reportLeasedAreaService
			.getLeasedArea(imovelId, status, tipoImovelId, locatarioId, locadorId)
			.pipe(first())
			.subscribe({
				next: (data) => {
					if (data) {
						this.resultEntries = data;
						this.noRestults = this.resultEntries.length == 0;

						this.totalSum = data.reduce(
							(acc, entry) => {
								acc.area += entry.somaAreaTotal;
								acc.areaUtil += entry.somaAreaUtil;
								acc.areaHabitese += entry.somaAreaHabitese;
								acc.aluguelContratado += entry.somaValorAluguel;
								acc.aluguelPotencial += entry.somaValorPotencial;

								return acc;
							},
							{
								area: 0,
								areaUtil: 0,
								areaHabitese: 0,
								aluguelContratado: 0,
								aluguelPotencial: 0,
							}
						);
					}
				},
				error: () => {
					console.error(console.error);
				},
				complete : () => this.isLoading = false
			});
	};

	getOwnersListData() {
		this.rentContract
			.getActiveOwners()
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
		this.commonService
			.getUnitType()
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

	truncateChar(text: string): string {
		const charlimit = 48;
		if (!text || text.length <= charlimit) {
			return text;
		}

		const without_html = text.replace(/<(?:.|\n)*?>/gm, '');
		const shortened = without_html.substring(0, charlimit) + '...';
		return shortened;
	};
}
