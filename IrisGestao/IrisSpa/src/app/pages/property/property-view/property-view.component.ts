import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs/internal/operators/first';
import {
	Imovel,
	ImovelUnidade,
	ImageData as ImagemData,
} from 'src/app/shared/models';
import { ImovelService } from 'src/app/shared/services';
import {
	AnexoService,
	Attachment,
} from 'src/app/shared/services/anexo.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-property-view',
	templateUrl: './property-view.component.html',
	styleUrls: ['./property-view.component.scss'],
})
export class PropertyViewComponent implements OnInit {
	tableMenu: MenuItem[];
	uid: string;
	property: Imovel;
	unit: ImovelUnidade | undefined;
	units: ImovelUnidade[] = [];
	imageList: ImagemData[] = [];
	eventos: any[] = [];

	hasAttachmentDocs: boolean = false;

	attachmentList: { fileName: string; fileLocation: string }[] = [];

	unitCover: string | undefined | null;
	unitDocs: {
		projeto?: { name: string; uri: string } | undefined;
		matricula?: { name: string; uri: string } | undefined;
		habitese?: { name: string; uri: string } | undefined;
	};

	isMobile: boolean = false;
	unitListAmount = 4;

	coverImage: string | undefined;

	isFavorite = true;
	isInativarImovel = false;
	detailsVisible = false;
	isLoadingView = false;
	isCorporativeBuilding = false;
	displayConfirmationInactiveUnitModal = false;
	displayConfirmationInactiveImovelModal = false;
	displayConfirmationCloneUnit = false;
	displayModal = false;

	displayAddEvent = false;

	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private imovelService: ImovelService,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';
		});
	}

	ngOnInit(): void {
		this.tableMenu = [
			{
				label: 'Detalhes',
				icon: 'ph-eye',
				command: () => this.showDetails(),
			},
			{
				label: 'Editar',
				icon: 'ph-note-pencil',
				command: () =>
					this.navigateTo('property/edit/unit/' + this.unit!.guidReferencia),
			},
			{
				label: 'Duplicar',
				icon: 'ph-copy-simple',
				command: () => this.confirmClone(),
			},
			{
				label: 'Inativar',
				icon: 'ph-trash',
				command: () => this.confirmInativar(),
			},
		];

		this.getData();

		this.anexoService
			.getFiles(this.uid)
			.pipe(first())
			.subscribe({
				next: (event) => {
					const cover = event?.find(
						({ classificacao }: { classificacao: string }) =>
							classificacao === 'capa'
					);

					if (cover) this.coverImage = cover.local;

					console.log(this.coverImage);
				},
				error: (error) => {
					console.error('Erro: ', error);
				},
			});

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});
	}

	onUpdateUnitList = (modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	}) => {
		this.getData();

		this.modalContent = modalContent;
		this.displayModal = true;
	};

	showMoreUnits() {
		this.unitListAmount =
			this.unitListAmount + 4 > this.units.length
				? this.units.length
				: this.unitListAmount + 4;
	}

	toggleFavorite() {
		this.isFavorite = !this.isFavorite;
	}

	showDetails() {
		this.detailsVisible = !this.detailsVisible;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	confirmInativar() {
		this.displayConfirmationInactiveUnitModal = true;
	}

	confirmClone(): void {
		this.displayConfirmationCloneUnit = true;
	}

	closeConfirmationInativarModal() {
		this.displayConfirmationInactiveUnitModal = false;
	}

	confirmImovelInativar() {
		this.displayConfirmationInactiveImovelModal = true;
	}

	closeConfirmationInativarImovelModal() {
		this.displayConfirmationInactiveImovelModal = false;
	}

	closeConfirmationCloneUnit() {
		this.displayConfirmationCloneUnit = false;
	}

	getData(): void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getProperty(this.uid)
			?.pipe(first())
			.subscribe((imovel: Imovel) => {
				this.property = imovel;
				this.units = imovel.unidade!;
				this.imageList = imovel.imagens!;
				this.eventos = imovel.eventos!;
				this.isLoadingView = false;
				this.isCorporativeBuilding =
					this.units[0]?.idTipoUnidadeNavigation?.id == 1;
				//console.log('Eventos >> ' + JSON.stringify(this.eventos)); 
				this.anexoService
					.getFiles(imovel.guidReferencia)
					.pipe(first())
					.subscribe({
						next: (response) => {
							let photos: Attachment[] = [];

							response?.forEach((file) => {
								const classificacao = file.classificacao;

								switch (classificacao) {
									case 'foto':
										photos.push(file);
										break;
									case 'projeto':
									case 'matricula':
									case 'habitese':
									case 'outrosdocs':
										this.hasAttachmentDocs = true;
										break;
									default:
										break;
								}

								if (classificacao !== 'foto')
									this.attachmentList.push({
										fileName: file.nome,
										fileLocation: file.local,
									});
							});

							this.imageList =
								photos?.map((photo) => {
									return {
										url: photo.local,
										thumbUrl: photo.local,
										alt: photo.nome,
									};
								}) ?? [];
						},
						error: (err) => {
							// console.error(err)
							console.log('>>>>', err);
							this.imageList = [];
						},
					});
			});
	}

	setCurrentUnit(item: ImovelUnidade): void {
		this.unit = item;

		item.guidReferencia && this.getUnitFiles(item.guidReferencia);
	}

	getUnitFiles(guid: string) {
		this.unitCover = null;
		this.unitDocs = {};

		this.anexoService
			.getFiles(guid)
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.forEach((file) => {
						if (file.classificacao === 'foto') {
							if (this.unitCover === null) this.unitCover = file.local;
						} else if (file.classificacao === 'projeto') {
							this.unitDocs.projeto = { name: file.nome, uri: file.local };
						} else if (file.classificacao === 'matricula') {
							this.unitDocs.matricula = { name: file.nome, uri: file.local };
						} else if (file.classificacao === 'habitese') {
							this.unitDocs.habitese = { name: file.nome, uri: file.local };
						}
					});
				},
				error: (err) => {
					// console.error(err)
				},
			});
	}

	cloneUnitModal(): void {
		this.cloneUnit(this.unit?.guidReferencia || '');
		this.closeConfirmationCloneUnit();
	}

	cloneUnit(uid: string): void {
		this.isLoadingView = true;

		this.imovelService
			.cloneUnit(uid)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Operação realizada com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Operação não realizada',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
					this.isLoadingView = false;
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Operação não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
					this.isLoadingView = false;
				},
			});
	}

	inativarUnit() {
		this.closeConfirmationInativarModal();
		this.imovelService
			.inactiveUnit(this.unit!.guidReferencia!, false)
			.subscribe({
				next: (response) => {
					console.log('inativarUnit >> retorno ' + JSON.stringify(response));
					if (response.success) {
						this.closeConfirmationInativarModal();
						//this.isInativar = true;
						this.onUpdateUnitList({
							header: 'Unidade Inativada',
							message: response.message ?? 'Unidade inativada com sucesso',
						});
					} else {
						this.onUpdateUnitList({
							header: 'Unidade não inativada',
							message: response.message ?? 'Erro na inativação da Unidade',
							isError: true,
						});
					}
				},
				error: (err) => {
					console.error(err);
					this.onUpdateUnitList({
						header: 'Unidade não inativada',
						message: 'Erro no envio de dados',
						isError: true,
					});
				},
			});
	}

	inativarImovel() {
		this.closeConfirmationInativarImovelModal();
		this.imovelService.inactiveImovel(this.uid, false).subscribe({
			next: (response) => {
				console.log('inactiveImovel >> retorno ' + JSON.stringify(response));
				if (response.success) {
					this.closeConfirmationInativarImovelModal();
					this.isInativarImovel = true;
					this.onUpdateUnitList({
						header: 'Imóvel Inativado',
						message: response.message ?? 'Imóvel inativado com sucesso',
					});
				} else {
					this.onUpdateUnitList({
						header: 'Imóvel não inativado',
						message: response.message ?? 'Erro na inativação do Imóvel',
						isError: true,
					});
				}
			},
			error: (err) => {
				console.error(err);
				this.onUpdateUnitList({
					header: 'Imóvel não inativado',
					message: 'Erro no envio de dados',
					isError: true,
				});
			},
		});
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	reloadPage() {
		this.closeModal();
		this.getData();
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
}
