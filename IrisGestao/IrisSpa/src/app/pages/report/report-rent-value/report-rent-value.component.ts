import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, PipeTransform, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { AreaPipe } from 'src/app/shared/pipes/area.pipe';
import { ClienteService, CommonService, ReportService } from 'src/app/shared/services';
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

	filterImovel: string;
	filterTipoImovel: string;
	filterLocador: string;
	filterLocatario: string;
	filterStatus: string;

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
		private activatedRoute: ActivatedRoute,
		private responsiveService: ResponsiveService,
		private reportService: ReportService,
		private clienteService: ClienteService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			area: new AreaPipe(),
			currency: new CurrencyPipe('pt-BR', 'R$'),
		};

		this.getData();
	};

	filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		console.log(e);
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

	getData() : void {
		this.isLoading = true;

		this.reportService
			.getRentValue()
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
				}, complete : () => this.isLoading = false,
			});
	
	};

	exportarExcell(): void {
		Utils.saveReportAsExcell(this.childElement.nativeElement, 'valor-aluguel', 'Relatório Valor de Aluguel');
	};

	getOwnersListData() {
		this.clienteService
			.getListaProprietariosNew()
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
