import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { PropertyService } from 'src/app/shared/services';

@Component({
	selector: 'app-property-listing',
	templateUrl: './property-listing.component.html',
	styleUrls: ['./property-listing.component.scss'],
})
export class PropertyListingComponent implements OnInit {
	properties:any = [];

	constructor(private propertyService: PropertyService) {}

	ngOnInit(): void {
		this.getData();
	}

	getData()	{

		const properties = this.propertyService
			.getPerperties()
			?.pipe(first())
			.subscribe((event: any) => {
				this.properties = [];

				event.forEach((property: any) => {
					console.debug('property', property);
					this.properties.push({
						nome: property?.nome,
						endereco: property?.endereco ?? 'N/D',
						// tipo: property?.idCategoriaImovelNavigation?.nome,
						// unidades: property?.unidade.length,
						// metros: 1321,
						// proprietario: {
						// 	nome: property?.idClienteProprietarioNavigation?.nome,
						// 	cpfCnpj: `01221344222`,
						// 	telefone: 61245345345
						// }
						// ,
						client_type: 'Locatário',
						status: 'ativo',
						action: '',
					});
				});
			});
		
	};
}
