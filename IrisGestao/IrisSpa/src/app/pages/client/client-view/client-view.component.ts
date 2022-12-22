import { identifierName } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../shared/services/cliente.service';

@Component({
	selector: 'app-client-view',
	templateUrl: './client-view.component.html',
	styleUrls: ['./client-view.component.scss'],
	providers: [ClienteService, DatePipe]
})
export class ClientViewComponent  implements OnInit {

	id: number;
	cliente: any;
	totalClientCount: number;
	isLoadingClients = false;
	

	constructor(private clienteService: ClienteService,
		private activeRouter: ActivatedRoute,
		private datePipe: DatePipe,
		private router: Router,) {
	
		  this.activeRouter.paramMap.subscribe(paramMap => {
			//this.id = parseInt(paramMap.get('id'));
			this.id = 4; 
			
		  });
	
		}

		ngOnInit(): void {

			this.getByIdCliente();
		}

		getByIdCliente()
		{
		  this
		  .clienteService
		  .getClienteById(this.id)
		  .subscribe(_cliente => {
		   this.cliente = _cliente[0];
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
