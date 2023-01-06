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

	isFavorite = true;
	detailsVisible = false;
	isLoadingView = false;
	isCorporativeBuilding = false;

	displayModal = false;
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
		private imovelService: ImovelService
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
				command: () => this.cloneUnit(this.unit!.guidReferencia!),
			},
		];

		this.getData();
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

	getData(): void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getProperty(this.uid)
			?.pipe(first())
			.subscribe((imovel: Imovel) => {
				this.property = imovel;
				this.units = imovel.unidade!;
				this.imageList = imovel.imagens!;
				this.isLoadingView = false;
				this.isCorporativeBuilding =
					this.units[0].idTipoUnidadeNavigation?.id == 1;
			});
	}

	setCurrentUnit(item: ImovelUnidade): void {
		this.unit = item;
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
}
