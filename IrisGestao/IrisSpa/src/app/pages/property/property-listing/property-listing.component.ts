import { Component, OnInit } from '@angular/core';
import { PropertyItemData } from 'src/app/shared/models';

@Component({
	selector: 'app-property-listing',
	templateUrl: './property-listing.component.html',
	styleUrls: ['./property-listing.component.scss'],
})
export class PropertyListingComponent implements OnInit {
	propertyItens: PropertyItemData[] = [
		{
			image_address: '../../../../assets/images/imovel.png',
			name: 'Nome do edifício lorem ipsum',
			code: 3124322,
			address: 'Avenida São Paulo, 2803 - Centro, Mangaguá - SP',
			property_type: 'wallet',
			type: 'Edifício Corporativo',
			unit_amount: 356,
			area: 1321,
			proprietary: {
				name: 'Matheus Gomes',
				cpf_cnpj: '01221344222',
				telephone: '(81) 99433-1022',
			},
		},
		{
			image_address: '../../../../assets/images/imovel.png',
			name: 'Nome do edifício outro',
			code: 5649843,
			address: 'Rua Pato Branco, 771 - Água Verde, Laranjeiras do Sul - PR',
			property_type: 'market',
			type: 'Sala / Pavimento Corporativo',
			unit_amount: 240,
			area: 985,
			proprietary: {
				name: 'Jonathan Gonçalves',
				cpf_cnpj: '784.459.620-19',
				telephone: '(42) 98430-6314',
			},
		},
		{
			image_address: '../../../../assets/images/imovel.png',
			name: 'Nome do edifício lorem ipsum',
			code: 3124322,
			address: 'Avenida São Paulo, 2803 - Centro, Mangaguá - SP',
			property_type: 'wallet',
			type: 'Edifício Corporativo',
			unit_amount: 356,
			area: 1321,
			proprietary: {
				name: 'Matheus Gomes',
				cpf_cnpj: '01221344222',
				telephone: '(81) 99433-1022',
			},
		},
		{
			image_address: '../../../../assets/images/imovel.png',
			name: 'Nome do edifício outro',
			code: 5649843,
			address: 'Rua Pato Branco, 771 - Água Verde, Laranjeiras do Sul - PR',
			property_type: 'market',
			type: 'Sala / Pavimento Corporativo',
			unit_amount: 240,
			area: 985,
			proprietary: {
				name: 'Jonathan Gonçalves',
				cpf_cnpj: '784.459.620-19',
				telephone: '(42) 98430-6314',
			},
		},
		{
			image_address: '../../../../assets/images/imovel.png',
			name: 'Nome do edifício lorem ipsum',
			code: 3124322,
			address: 'Avenida São Paulo, 2803 - Centro, Mangaguá - SP',
			property_type: 'wallet',
			type: 'Edifício Corporativo',
			unit_amount: 356,
			area: 1321,
			proprietary: {
				name: 'Matheus Gomes',
				cpf_cnpj: '01221344222',
				telephone: '(81) 99433-1022',
			},
		},
		{
			image_address: '../../../../assets/images/imovel.png',
			name: 'Nome do edifício outro',
			code: 5649843,
			address: 'Rua Pato Branco, 771 - Água Verde, Laranjeiras do Sul - PR',
			property_type: 'market',
			type: 'Sala / Pavimento Corporativo',
			unit_amount: 240,
			area: 985,
			proprietary: {
				name: 'Jonathan Gonçalves',
				cpf_cnpj: '784.459.620-19',
				telephone: '(42) 98430-6314',
			},
		},
	];

	constructor() {}

	ngOnInit(): void {}
}
