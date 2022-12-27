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
			//console.debug('Imovel Data >> ' + JSON.stringify(imovel));
			this.properties.push(imovel);
		});
		});
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
