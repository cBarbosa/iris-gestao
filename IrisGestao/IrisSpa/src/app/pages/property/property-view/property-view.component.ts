import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { first } from 'rxjs/internal/operators/first';
import { Imovel, ImovelUnidade, ImageData as ImagemData } from 'src/app/shared/models';
import { ImovelService } from 'src/app/shared/services';

@Component({
	selector: 'app-property-view',
	templateUrl: './property-view.component.html',
	styleUrls: ['./property-view.component.scss'],
})
export class PropertyViewComponent {
	tableMenu: MenuItem[];
	property: Imovel;
	unit: ImovelUnidade | undefined;
	units: ImovelUnidade[] = [];
	imageList: ImagemData[] = [];

	isFavorite = true;
	detailsVisible = false;
	isLoadingView = false;


	constructor(
		private router: Router
		, private route: ActivatedRoute
		, private imovelService: ImovelService) {}

	ngOnInit() {
		this.tableMenu = [
			{
				label: 'Detalhes',
				icon: 'ph-eye',
				command: () => this.showDetails(),
			},
			{
				label: 'Editar',
				icon: 'ph-note-pencil',
				command: () => this.navigateTo('property/edit/'+ this.unit?.guidReferencia),
			},
			{
				label: 'Duplicar',
				icon: 'ph-copy-simple'
			}
		];

		this.route.params.subscribe(params => {
			this.getData(params['uid']);
		});
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

	getData(uid: string) : void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getProperty(uid)
			?.pipe(first())
			.subscribe((imovel: Imovel) => {
				this.property = imovel;
				this.units = imovel.unidade!;
				this.imageList = imovel.imagens ?? [];
				this.isLoadingView = false;
			});
	}

	setCurrentUnit(item: ImovelUnidade) :void {
		this.unit = item;
	}

}
