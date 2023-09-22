import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ImageData } from 'src/app/shared/models';
import { DominiosService, LoginService } from 'src/app/shared/services';
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
	registerInvoiceVisible = false;

	displayModal: boolean = false;

	editSuccess = false;

	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	totalSum:
		| {
				TotalOrcado: number;
				TotalContratado: number;
				TotalSaldo: number;
		  }
		| undefined;

	isFormEditable:boolean = true;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private constructionService: ConstructionService,
		private dominiosService: DominiosService,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService,
		private loginService: LoginService
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

		this.isFormEditable = this.loginService.usuarioLogado.perfil?.toLowerCase() !== 'analista';
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
		this.construction = null;
		this.constructionService
			.getConstructionByGuid(this.guid)
			.pipe(first())
			.subscribe({
				next: (event: any) => {
					if (event.success) {
						this.construction = event.data;
						this.imageList = event.imagens ?? [];
						// console.log('Detalhes Cliente >> ' + JSON.stringify(event));
						// this.properties = [...event.data.imovel];
						this.propertyGuid = event.data.imovel?.guidReferencia as string;

						this.totalSum = this.construction.servicos.reduce(
							(acc:any, entry: any) => {
								acc.TotalOrcado += entry.valorOrcado;
								acc.TotalContratado += entry.valorContratado ?? 0;
								acc.TotalSaldo += (entry.valorOrcado - (entry.valorContratado ?? 0));

								return acc;
							},
							{
								TotalOrcado: 0,
								TotalContratado: 0,
								TotalSaldo: 0
							}
						);
					}
				},
				error: (err) => {
					this.construction = null;
				},
				complete: () => {
					this.isLoadingView = false;
				}
			});
	}

	setCurrentService = (item: any): void => {
		item.percentualAdministracaoObra = this.construction?.percentual ?? 0.0;
		this.serviceSelected = item;
	};

	showServiceDetails = (): void => {
		this.serviceDetailsVisible = true;
		this.registerInvoiceVisible = false;
		this.issueInvoiceVisible = false;
	};

	showIssueInvoice = (): void => {
		if(!this.isFormEditable)	return;
		this.serviceDetailsVisible = false;
		this.registerInvoiceVisible = false;
		this.issueInvoiceVisible = true;
	};
	showRegisterInvoice = (): void => {
		this.serviceDetailsVisible = false;
		this.issueInvoiceVisible = false;
		this.registerInvoiceVisible = true;
	};

	hideServiceDetails = () => {
		this.serviceDetailsVisible = false;
	};

	hideIssueInvoice = () => {
		this.issueInvoiceVisible = false;
	};

	hideRegisterInvoice = () => {
		this.registerInvoiceVisible = false;
	};

	toggleServiceDetails() {
		this.displayConstructionDetails = !this.displayConstructionDetails;
	}

	onInvoiceEditSubmit = (values: any) => {
		
		const formObj: {
			Descricao: string;
			NumeroNota: string;
			DataEmissao?: string;
			// DataVencimento: string;
			ValorOrcado: number;
			ValorContratado?: number;
			// Percentual?: number;
		} = {
			Descricao: values.formValues.descricao,
			NumeroNota: values.formValues.numeroNota ?? '',
			DataEmissao: values.formValues.dataEmissao
				? values.formValues.dataEmissao?.toISOString()
				: null,
			// DataVencimento: values.formValues.dataVencimentoFatura
			// 	? values.formValues.dataVencimentoFatura?.toISOString()
			// 	: null,
			ValorOrcado: values.formValues.valorOrcamento,
			ValorContratado: values.formValues.valorContratado
			// Percentual: +values.formValues.porcentagemAdm ?? null
		};

		this.constructionService
			.updateObraServico(this.serviceSelected.guidReferencia, formObj)
			.pipe(first())
			.subscribe({
				next: (response) => {

					if (response.success) {
						this.modalContent = {
							header: 'Edição realizado com sucesso',
							message: response.message ?? '',
							isError: false,
						};

						const formData = new FormData();

						formData.append('files', values.invoiceFile);

						this.anexoService.registerFile(
							this.serviceSelected.guidReferencia,
							formData,
							'outrosdocs'
						).subscribe(result => JSON.stringify(result));

						this.editSuccess = true;
					} else {
						this.modalContent = {
							header: 'Edição não realizado',
							message: response.message ?? '',
							isError: true,
						};
					}
				},
				error: (err) => {
					console.error(err);
					this.modalContent = {
						header: 'Edição não realizado',
						message: err ?? '',
						isError: true,
					};
				},
				complete: () => {
					this.openModal();
				}
			});
	};

	onInvoiceRegisterSubmit = (values: any) => {

		const formObj: {
			Descricao: string;
			NumeroNota: string;
			DataEmissao?: string;
			// DataVencimento: string;
			ValorOrcado: number;
			ValorContratado?: number;
			// Percentual: number;
		} = {
			Descricao: values.formValues.descricao,
			NumeroNota: values.formValues.numeroNota ?? '',
			DataEmissao: values.formValues.dataEmissao
				? values.formValues.dataEmissao?.toISOString()
				: null,
			// DataVencimento: values.formValues.dataVencimentoFatura
			// 	? values.formValues.dataVencimentoFatura?.toISOString()
			// 	: null,
			ValorOrcado: values.formValues.valorOrcamento,
			ValorContratado: values.formValues.valorContratado
			// Percentual: +values.formValues.porcentagemAdm ?? null
		};

		this.constructionService
			.registerObraServico(this.guid, formObj)
			.pipe(first())
			.subscribe({
				next: (response) => {

					if (response.success) {
						this.modalContent = {
							header: 'Cadastro realizado com sucesso',
							message: response.message ?? '',
							isError: false,
						};

						this.editSuccess = true;

						const formData = new FormData();

						formData.append('files', values.invoiceFile);

						this.anexoService.registerFile(
							response.data?.guidReferencia,
							formData,
							'outrosdocs'
						).subscribe(result => JSON.stringify(result));
					} else {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message: response.message ?? '',
							isError: true,
						};
					}
				},
				error: (err) => {
					console.error(err);
					this.modalContent = {
						header: 'Cadastro não realizado',
						message: err ?? '',
						isError: true,
					};
				},
				complete: () => {
					this.openModal();
				}
			});
	};

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

	openModal() {
		this.displayModal = true;
	}

	closeModal() {
		this.displayModal = false;

		if (this.editSuccess) {
			this.editSuccess = false;
			location.reload();
		}
	}

}
