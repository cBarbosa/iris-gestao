import { identifierName } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Imovel } from 'src/app/shared/models';
import { ClienteService } from '../../../shared/services/cliente.service';

@Component({
	selector: 'app-client-view',
	templateUrl: './client-view.component.html',
	styleUrls: ['./client-view.component.scss'],
	providers: [ClienteService, DatePipe]
})
export class ClientViewComponent  implements OnInit {
	properties: Imovel[] = [];
	uid: string;
	cliente: any;
	totalClientCount: number;
	isLoadingClients = false;
	

	constructor(
		private router: Router
		, private route: ActivatedRoute
		, private clienteService: ClienteService) {

			this.route.paramMap.subscribe(paramMap => {
				this.uid = paramMap.get('uid') ?? ''; 
			});
		};

		ngOnInit(): void {

			this.getByIdCliente();
		}

		getByIdCliente()
		{
		  this
		  .clienteService
		  .getClienteById(this.uid)
		  .subscribe(event => {
		   this.cliente = event;
		   event.imovel.forEach((imovel: Imovel) => {
			// console.debug('Imovel Data >> ' + JSON.stringify(imovel));
			this.properties.push(imovel);
		});
		   //this.proposal = protocol.data.protocolProposal;
		   console.log('this.cliente >> ' + JSON.stringify(this.cliente));
	  
		  });
		}
		
	propertyItens: any[] = [
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
}
