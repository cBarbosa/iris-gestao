import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../shared/services/cliente.service';
import { DominiosService } from '../../../shared/services/dominios.service';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-client-edit',
	templateUrl: './client-register.component.html',
	styleUrls: ['./client-register.component.scss'],
})
export class ClientRegisterComponent {
	cliente: any;
	registerForm: FormGroup;
	dropdownTipoCliente: any;
	onInputDate: Function;
	onBlurDate: Function;
	tiposCliente = [
		{
			label: 'Selecione',
			value: null,
		}
	];

	clientTypes = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Pessoa física',
			value: 'fisica',
		},
		{
			label: 'Pessoa jurídica',
			value: 'juridica',
		},
	];

	constructor(private fb: FormBuilder, 
		private router: Router, 
		private location: Location, 
		private clienteService: ClienteService,
		private dominiosService: DominiosService) { }

	ngOnInit() {
		this.registerForm = this.fb.group({
			CpfCnpj: ['', [Validators.required]],
			IdTipoCliente: [null, [Validators.required]],
			nome: ['', Validators.required],
			razaoSocial: [''],
			endereco: [''],
			bairro: [''],
			cidade: [''],
			estado: [''],
			cep: ['', Validators.required],
			dataNascimento: [null, [Validators.required]],
			email: ['', [Validators.required]],
			telefone: ['', [Validators.required]],
		});

		this.getTiposCliente();
		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.registerForm.controls;
	}

	getTiposCliente(): void {
		const tipoCliente = this.dominiosService
			.getTipoCliente()
			.subscribe(event => {
				//console.log('getTiposCliente >> TipoCliente >> ' + JSON.stringify(event));
				this.dropdownTipoCliente = event;
				this.dropdownTipoCliente.data.forEach((tipo: any) => {
					this.tiposCliente.push({
						label: tipo.nome,
						value: tipo.id
					});
				});
			});
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: any = null) {
		console.log('submitting form');
		console.log('onSubmit >> dados >> ' + JSON.stringify(this.registerForm.value));

		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();

			const criarCliente = this.clienteService
			.criarCliente(this.registerForm.value)
			.subscribe(event => {
				console.log('onSubmit >> Retorno Criar >> ' + JSON.stringify(event));
				this.cliente = event;
				this.router.navigate(['client/details/' + this.cliente.guidReferencia]);	
				});
			};
				
		console.log('form submitted');
		return;
	

	}

	goBack() {
		this.location.back();
	}
}
