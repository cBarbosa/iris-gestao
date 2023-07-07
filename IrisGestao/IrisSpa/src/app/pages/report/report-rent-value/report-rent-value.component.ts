import { CurrencyPipe, PercentPipe } from '@angular/common';
import {
	Component,
	ElementRef,
	PipeTransform,
	ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
	LazyLoadEvent,
	MenuItem
} from 'primeng/api';
import { first } from 'rxjs';
import { AreaPipe } from 'src/app/shared/pipes/area.pipe';
import {
	CommonService,
	RentContractService,
	ReportService
} from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-report-rent-value',
  templateUrl: './report-rent-value.component.html',
  styleUrls: ['./report-rent-value.component.scss']
})
export class ReportRentValueComponent {
	@ViewChild('reportToPdf', {read: ElementRef}) childElement: ElementRef<HTMLElement>;
	
	isLoading: boolean = true;
	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
	noRestults: boolean = false;
	totalAreaCount: number;

	resultEntries: any[];

	first = 0;
	rows = 10;

	filterImovel: number;
	filterTipoImovel: number;
	filterLocador: number;
	filterLocatario: number;
	filterStatus: boolean;
	filterReferencia: Date;

	cardPipes: Record<string, PipeTransform>;

	totalSum:
		| {
				area: number;
				aluguelContratado: number;
				aluguelPotencial: number;
				precoM2: number;
				precoMesReferencia: number;
		  }
		| undefined;

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
  
  constructor(
		private router: Router,
		private responsiveService: ResponsiveService,
		private reportService: ReportService,
		private rentContract: RentContractService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			area: new AreaPipe(),
			currency: new CurrencyPipe('pt-BR', 'R$'),
			percent: new PercentPipe("2.2-2")
		};

		this.init();
	};

	init():void {
		const currYear = new Date().getFullYear();
		const currMonth = new Date().getMonth();
		
		this.filterReferencia = new Date(currYear, currMonth, 1);

		this.filterResult();
		this.getOwnersListData();
		this.getUnitTypesData();
		this.getPropertiesListData();
	};

	filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		this.isLoading = true;

		const dateString = this.filterReferencia.toISOString().split('T')[0];
		const idLocador = this.filterLocador ?? null;
		const idTipo = this.filterTipoImovel ?? null;
		const idImovel = this.filterImovel ?? null;
		const status = this.filterStatus ?? null;

		this.getData(idImovel, status, idTipo, undefined, idLocador, dateString);

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

	exportarPdf(): void {
		Utils.saveReportAsPdf(this.childElement.nativeElement, 'valor-aluguel', 'Relatório Valor de Aluguel');
	};

	getData(
		imovelId?: number,
		status?: boolean,
		tipoImovelId?: number,
		locatarioId?: number,
		locadorId?: number,
		dateRef?: string) : void {

		this.isLoading = true;

		this.reportService
			.getRentValue(imovelId, status, tipoImovelId, locatarioId, locadorId, dateRef)
			.pipe(first())
			.subscribe({
				next: (data) => {
					if (data) {
						this.resultEntries = data;

						this.totalSum = data.reduce(
							(acc, entry) => {
								acc.area += entry.somaAreaUtil;
								acc.aluguelContratado += entry.somaValorAluguel;
								acc.aluguelPotencial += entry.somaValorPotencial;
								acc.precoM2 += entry.somaPrecoM2;
								acc.precoMesReferencia += entry.precoMesReferencia;
								return acc;
							},
							{
								area: 0,
								aluguelContratado: 0,
								aluguelPotencial: 0,
								precoM2: 0,
								precoMesReferencia: 0,
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

	exportarExcell(): void {
		Utils.saveReportAsExcell(this.childElement.nativeElement, 'valor-aluguel', 'Relatório Valor de Aluguel');
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
