import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-report-rent-value',
  templateUrl: './report-rent-value.component.html',
  styleUrls: ['./report-rent-value.component.scss']
})
export class ReportRentValueComponent {
	@ViewChild('reportToPdf', {read: ElementRef}) childElement: ElementRef<HTMLElement>;
	
	isLoading: boolean = false;
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
  
  constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit(): void {};

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
}
