import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ImageData, Imovel } from 'src/app/shared/models';
import {
	Construcao,
	IConstrucao,
} from 'src/app/shared/models/construcao.model';
import {
	AnexoService,
	Attachment,
} from 'src/app/shared/services/anexo.service';
import { ConstructionService } from 'src/app/shared/services/obra.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-construction-view',
	templateUrl: './construction-view.component.html',
	styleUrls: ['./construction-view.component.scss'],
})
export class ConstructionViewComponent {
	propertyGuid: string | null = null;
	guid: string;
	construction: any;
	imageList: ImageData[] = [];
	hasDocs: boolean;
	isLoadingView = true;

	isMobile: boolean = false;
	displayConstructionDetails = false;
	cardPipes: Record<string, PipeTransform>;

	serviceSelected: any;

	serviceDetailsVisible = false;
	issueInvoiceVisible = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private constructionService: ConstructionService,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.guid = paramMap.get('guid') ?? '';
		});
	}

	ngOnInit(): void {
		this.getByIdConstruction();
		this.getAttachs();

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

	getAttachs(): void {
		this.anexoService
			.getFiles(this.guid)
			.pipe(first())
			.subscribe({
				next: (response) => {
					let photos: Attachment[] = [];

					response?.forEach((file) => {
						const classificacao = file.classificacao;

						if (classificacao === 'foto') photos.push(file);
						else if (!this.hasDocs) this.hasDocs = true;

						this.imageList =
							photos?.map((photo) => {
								return {
									url: photo.local,
									thumbUrl: photo.local,
									alt: photo.nome,
								};
							}) ?? [];
					});
				},
				error: (err) => {
					console.error(err);
					this.imageList = [];
				},
			});
	}

	getByIdConstruction() {
		this.isLoadingView = true;
		this.constructionService
			.getConstructionByGuid(this.guid)
			.pipe(first())
			.subscribe({
				next: (event: any) => {
					console.log('event', event);
					if (event.success) {
						this.construction = event.data[0];
						this.imageList = event.imagens ?? [];
						//console.log('Detalhes Cliente >> ' + JSON.stringify(event));
						// this.properties = [...event.data.imovel];
						this.propertyGuid = event.data[0].imovel?.guidReferencia as string;
					} else {
						this.construction = null;
					}
					this.isLoadingView = false;
				},
				error: (err) => {
					this.construction = null;
					this.isLoadingView = false;
				},
			});

		this.isLoadingView = false;
	}

	setCurrentService = (item: any): void => {
		console.log('Contrato Selecionado >> ', item);
		this.serviceSelected = item;
	};

	showServiceDetails = (): void => {
		this.serviceDetailsVisible = true;
		this.issueInvoiceVisible = false;
	};

	showIssueInvoice = (): void => {
		this.serviceDetailsVisible = false;
		this.issueInvoiceVisible = true;
	};

	hideServiceDetails = () => {
		this.serviceDetailsVisible = false;
	};

	hideIssueInvoice = () => {
		this.issueInvoiceVisible = false;
	};

	toggleServiceDetails() {
		this.displayConstructionDetails = !this.displayConstructionDetails;
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
