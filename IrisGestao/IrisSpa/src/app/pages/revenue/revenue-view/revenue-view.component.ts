import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Imovel } from 'src/app/shared/models';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { RevenueService } from 'src/app/shared/services/revenue.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-revenue-view',
	templateUrl: './revenue-view.component.html',
	styleUrls: ['./revenue-view.component.scss'],
})
export class RevenueViewComponent {
	property: Imovel | null = null;
	guid: string;
	revenue: any;
	imageList: ImageData[] = [];
	isLoadingView = true;

	isMobile: boolean = false;
	displayRevenueDetails = false;
	cardPipes: Record<string, PipeTransform>;

	faturaSelected: any;

	detalheBaixaVisible = false;
	baixaTituloVisible = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private revenueService: RevenueService,
		private responsiveService: ResponsiveService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.guid = paramMap.get('guid') ?? '';
		});
	}

	ngOnInit(): void {
		this.getByIdRevenue();
		// this.getAttachs();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
			currency: new CurrencyPipe('pt-BR', 'R$'),
			percent: new PercentPipe('pt-BR'),
		};
	}

	getByIdRevenue() {
		this.isLoadingView = true;
		this.revenueService
			.getRevenueByGuid(this.guid)
			.pipe(first())
			.subscribe({
				next: (event: any) => {
					console.log('event', event);
					if (event.success) {
						this.revenue = event.data[0];
						this.imageList = event.imagens ?? [];
						//console.log('Detalhes Cliente >> ' + JSON.stringify(event));
						// this.properties = [...event.data.imovel];
						this.property = event.data[0].imovel as unknown as Imovel;
					} else {
						this.revenue = null;
					}
					this.isLoadingView = false;
				},
				error: (err) => {
					this.revenue = null;
					this.isLoadingView = false;
				},
			});

		this.isLoadingView = false;
	}

	setCurrentFatura = (item: any): void => {
		console.log('Fatura Selecionado >> ', item);
		this.faturaSelected = item;
	};

	showDetalheBaixa = (): void => {
		this.detalheBaixaVisible = true;
		this.baixaTituloVisible = false;
	};

	showBaixaTitulo = (): void => {
		this.detalheBaixaVisible = false;
		this.baixaTituloVisible = true;
	};

	hideDetalheBaixa = () => {
		this.detalheBaixaVisible = false;
	};

	hideBaixaTitulo = () => {
		this.baixaTituloVisible = false;
	};

	toggleDetalheBaixa() {
		this.displayRevenueDetails = !this.displayRevenueDetails;
	}

	async downloadFile(
		file: File | string | ArrayBuffer | null,
		filename: string
	) {
		if (file instanceof File) {
			file = (await Utils.fileToDataUrl(file)).data;
		}

		if (file === null) return;

		Utils.saveAs(file, filename);
	}

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
	};
}