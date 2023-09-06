import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs';
import { RentContractService, ReportService, ResponsiveService } from 'src/app/shared/services';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-report-supply-contracts',
  templateUrl: './report-supply-contracts.component.html',
  styleUrls: ['./report-supply-contracts.component.scss']
})
export class ReportSupplyContractsComponent {
  	@ViewChild('reportToPdf', {read: ElementRef}) childElement: ElementRef<HTMLElement>;
	@ViewChild('newReportToPdf', {read: ElementRef}) newChildElement: ElementRef<HTMLElement>;
  
	isLoading: boolean = true;
	isMobile: boolean = false;
	displayMobileFilters: boolean = false;
  	totalRecords:number = 0;
  	resultEntries: any[];

	first = 0;
	rows = 10;

	filterImovel: number;
	filterLocador: number;
	filterLocatario: number;
	filterStatus: boolean;

	tabIndex: number = 0;

  opcoesImovel = [
		{
			label: 'Todos Imóveis',
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
		private rentContract: RentContractService
	) { };

	ngOnInit(): void {

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.init();
	};

	init():void {
		this.filterResult();
		this.getOwnersListData();
		this.getPropertiesListData();
		this.getRentersListData();
	};

	openFilters() {
		this.displayMobileFilters = true;
	}

  	filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		this.isLoading = true;

		const idLocador = this.filterLocador ?? null;
		const idLocatario = this.filterLocatario ?? null;
		const idImovel = this.filterImovel ?? null;

		if(this.tabIndex == 0)
			this.getRentData(idImovel, idLocador, idLocatario);
		else
			this.getSupplyData(idImovel, idLocador);
	};

  	filterResultDebounce: Function = Utils.debounce(this.filterResult, 1000);

  	exportarPdf(): void {
		const element = this.tabIndex == 0
			? this.childElement.nativeElement
			: this.newChildElement.nativeElement;

		const subject = this.tabIndex == 0
			? `Relatório contrato de fornecedor`
			: `Relatório contrato de aluguel`;

		Utils.saveReportAsPdf(element, 'gestao-contrato', subject);
	};

  	exportarExcell(): void {
		const element = this.tabIndex == 0
			? this.newChildElement.nativeElement
			: this.childElement.nativeElement;

		const subject = this.tabIndex == 0
			? `Relatório contrato de aluguel`
			: `Relatório contrato de fornecedor`;

		Utils.saveReportAsExcell(element, 'gestao-contrato', subject);
	};

  	loadResultPage(event: LazyLoadEvent): void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.filterResult(undefined, page);
			this.scrollTop();
		}
	}

  	scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	};

	getRentData(
		imovelId?: number,
		locadorId?: number,
		LocatarioId?: number) : void {

		this.isLoading = true;

		this.reportService
			.getRentContract(imovelId, locadorId, LocatarioId)
			.pipe(first())
			.subscribe({
				next: (data) => {
					if (data) {
						this.resultEntries = data;
						this.totalRecords = this.resultEntries.length;
					}
				},
				error: () => {
					console.error(console.error);
				},
				complete : () => this.isLoading = false,
			});
	
	};

	getSupplyData(
		imovelId?: number,
		LocadorId?: number) : void {

		this.isLoading = true;

		this.reportService
			.getSupplyContract(imovelId, LocadorId)
			.pipe(first())
			.subscribe({
				next: (data) => {
					if (data) {
						this.resultEntries = data;
						this.totalRecords = this.resultEntries.length;
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

	getRentersListData() {
		this.rentContract
			.getActiveRenters()
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

	truncateChar(text: string): string {
		const charlimit = 48;
		if (!text || text.length <= charlimit) {
			return text;
		}

		const without_html = text.replace(/<(?:.|\n)*?>/gm, '');
		const shortened = without_html.substring(0, charlimit) + '...';
		return shortened;
	};

	changeTab(i: number) {
		this.tabIndex = i;
		this.totalRecords = 0;
		this.filterResult();
	};
}
