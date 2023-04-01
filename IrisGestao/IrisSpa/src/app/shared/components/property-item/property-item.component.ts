import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IImovel } from '../../models';
import { AnexoService } from '../../services/anexo.service';
import { ResponsiveService } from '../../services/responsive-service.service';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	@Input('data')
	propertyData: IImovel;

	isMobile = true;

	constructor(
		private router: Router,
		private anexoService: AnexoService,
		private responsiveService: ResponsiveService
	) {}

	ngOnInit() {
		console.log(this.propertyData);

		this.anexoService.getFiles(this.propertyData.guidReferencia).subscribe({
			next: (response) => {
				this.propertyData.imgCapa =
					response?.find((file) => file.classificacao === 'capa')?.local ??
					'./assets/images/imovel-placeholder.png';
			},
			error(err) {
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
