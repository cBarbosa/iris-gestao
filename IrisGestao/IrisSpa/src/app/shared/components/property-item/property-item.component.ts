import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IImovel } from '../../models';
import { AnexoService } from '../../services/anexo.service';
import { ResponsiveService } from '../../services/responsive-service.service';
import { ImovelService } from '../../services';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	@Input('data')
	propertyData: IImovel = {
		guidReferencia: '',
		nome: undefined,
		nroUnidades: undefined,
		areaTotal: undefined,
		areaUtil: undefined,
		areaHabitese: undefined,
		imgCapa: undefined,
		numCentroCusto: undefined,
		idCategoriaImovelNavigation: undefined,
		idClienteProprietarioNavigation: undefined,
		imovelEndereco: undefined,
		unidade: undefined,
		imagens: undefined,
	};

	@Input('propertyGuid')
	guid: string;

	isMobile = true;

	constructor(
		private router: Router,
		private anexoService: AnexoService,
		private imovelService: ImovelService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit() {
		console.log(this.propertyData);

		this.anexoService
			.getFiles(this.propertyData?.guidReferencia ?? this.guid)
			.subscribe({
				next: (response) => {
					if (this.propertyData)
						this.propertyData = {
							...this.propertyData,
							imgCapa:
								response?.find((file) => file.classificacao === 'capa')
									?.local ?? './assets/images/imovel-placeholder.png',
						};
					else
						this.propertyData = {
							imgCapa:
								response?.find((file) => file.classificacao === 'capa')
									?.local ?? './assets/images/imovel-placeholder.png',
						} as IImovel;
				},
				error(err) {
					console.error(err);
				},
			});
		console.log('fetching', this.guid);

		if (this.guid)
			this.imovelService.getProperty(this.guid).subscribe({
				next: (response) => {
					if (this.propertyData)
						this.propertyData = { ...this.propertyData, ...response };
					else this.propertyData = response;
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
