import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import {
	ClienteService,
	DominiosService,
	ImovelService,
	CommonService
} from 'src/app/shared/services';
import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-property-edit',
	templateUrl: './property-edit.component.html',
	styleUrls: ['./property-edit.component.scss'],
})
export class PropertyEditComponent {
	editForm: FormGroup;

	propertyGuid: string;
	isLoading = true;
	invalidGuid = false;

	propertyCategories: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	proprietaries: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	dropdownUfList: DropdownItem[] = [
		{ label: 'Selecione', value: null, disabled: true },
		{ label: 'Acre', value: 'AC' },
		{ label: 'Alagoas', value: 'AL' },
		{ label: 'Amapá', value: 'AP' },
		{ label: 'Amazonas', value: 'AM' },
		{ label: 'Bahia', value: 'BA' },
		{ label: 'Ceará', value: 'CE' },
		{ label: 'Distrito Federal', value: 'DF' },
		{ label: 'Espírito Santo', value: 'ES' },
		{ label: 'Goías', value: 'GO' },
		{ label: 'Maranhão', value: 'MA' },
		{ label: 'Mato Grosso', value: 'MT' },
		{ label: 'Mato Grosso do Sul', value: 'MS' },
		{ label: 'Minas Gerais', value: 'MG' },
		{ label: 'Pará', value: 'PA' },
		{ label: 'Paraíba', value: 'PB' },
		{ label: 'Paraná', value: 'PR' },
		{ label: 'Pernambuco', value: 'PE' },
		{ label: 'Piauí', value: 'PI' },
		{ label: 'Rio de Janeiro', value: 'RJ' },
		{ label: 'Rio Grande do Norte', value: 'RN' },
		{ label: 'Rio Grande do Sul', value: 'RS' },
		{ label: 'Rondônia', value: 'RO' },
		{ label: 'Roraíma', value: 'RR' },
		{ label: 'Santa Catarina', value: 'SC' },
		{ label: 'São Paulo', value: 'SP' },
		{ label: 'Sergipe', value: 'SE' },
		{ label: 'Tocantins', value: 'TO' },
	];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private imovelService: ImovelService,
		private activatedRoute: ActivatedRoute,
		private commonService: CommonService,
		private router: Router
	) {}

	ngOnInit() {
		const propertyGuid = this.activatedRoute.snapshot.paramMap.get('uid');

		if (propertyGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.propertyGuid = propertyGuid;

		this.editForm = this.fb.group({
			proprietary: [null, Validators.required],
			name: ['', Validators.required],
			category: [null, Validators.required],
			costCentre: [null, [Validators.required]],
			zipcode: [null, [Validators.required]],
			street: ['', [Validators.required]],
			neighborhood: ['', [Validators.required]],
			city: ['', [Validators.required]],
			state: ['', [Validators.required]]
		});

		this.imovelService.getProperty(this.propertyGuid)
			.subscribe((event) => {
				if (event) {
					this.editForm.controls['proprietary'].setValue(
						event?.idClienteProprietarioNavigation?.id
					);
					this.editForm.controls['name'].setValue(event?.nome);
					this.editForm.controls['category'].setValue(
						event?.idCategoriaImovelNavigation?.id
					);
					this.editForm.controls['costCentre'].setValue(event?.numCentroCusto);
					this.editForm.controls['zipcode'].setValue(
						event?.imovelEndereco[0]?.cep
					);
					this.editForm.controls['street'].setValue(
						event?.imovelEndereco[0]?.rua
					);
					this.editForm.controls['state'].setValue(
						event?.imovelEndereco[0]?.uf
					);
					this.editForm.controls['neighborhood'].setValue(
						event?.imovelEndereco[0]?.bairro
					);
					this.editForm.controls['city'].setValue(
						event?.imovelEndereco[0]?.cidade
					);

					this.getListaProprietarios();
					this.getListaCategorias();

				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
		});

		
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: any) {
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const editFormData = this.editForm.getRawValue();

		const propertyObj = {
			Nome: editFormData.name,
			IdCategoriaImovel: +editFormData.category,
			IdClienteProprietario: +editFormData.proprietary,
			NumCentroCusto: +editFormData.costCentre,
			MonoUsuario: false,
			Classificacao: '',
			CEP: +editFormData.zipcode,
			Rua: editFormData.street,
			Cidade: editFormData.city,
			Bairro: editFormData.neighborhood,
			UF: editFormData.state,
		};

		this.imovelService
			.updateProperty(this.propertyGuid, propertyObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Atualização realizada com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Atualização não realizada',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Atualização não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
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

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};

	getListaProprietarios() : void {

		this.clienteService.getListaProprietarios()
			.subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.proprietaries.push({
						label: item.nome,
						value: item.id,
					});
				});
				this.editForm.controls['proprietary'].setValue(
					this.editForm.controls['proprietary'].value ?? null
				);
			}
		});
	}

	getListaCategorias() : void {
		this.dominiosService.getCategoriaImovel().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.propertyCategories.push({
						label: item.nome,
						value: item.id,
					});
				});
				this.editForm.controls['category'].setValue(
					this.editForm.controls['category'].value ?? null
				);
			}
		});
	};

	setAddressByCEP(e: any) {
		const cep = e.target.value.replace(/\D/g, '');

		// if (cep.length !== 8 || cep === this.prevCepInputValue) {
		// 	this.prevCepInputValue = cep;
		// 	return;
		// }

		// this.addressInfoForm.controls['Cep'].disable();
		// this.addressInfoForm.controls['Endereco'].disable();
		// this.addressInfoForm.controls['Bairro'].disable();
		// this.addressInfoForm.controls['Cidade'].disable();
		// this.addressInfoForm.controls['Estado'].disable();

		this.commonService
			.getAddressByCEP(cep)
			.pipe(first())
			.subscribe({
				next: (event) => {
					console.debug('cep', event);
					if (event.success) {
						if (event.data.resultado === '1') {

							// this.registerForm.patchValue({
							// 	propertyType: {
							// 		street: event.data.logradouro,
							// 		city: event.data.cidade,
							// 		neighborhood: event.data.bairro,
							// 		state: event.data.uf
							// 	}});

							

							this.editForm.controls['street'].setValue(event.data.logradouro);
							this.editForm.controls['city'].setValue(event.data.cidade);
							this.editForm.controls['neighborhood'].setValue(event.data.bairro);
							this.editForm.controls['state'].setValue(event.data.uf);

							console.debug('formData', this.editForm);

						}
					}

					// this.registerForm.controls['Cep'].enable();
					// this.registerForm.controls['Endereco'].enable();
					// this.registerForm.controls['Bairro'].enable();
					// this.registerForm.controls['Cidade'].enable();
					// this.registerForm.controls['Estado'].enable();
				},
				error: (err) => {
					console.error(err);

					// this.registerForm.controls['Cep'].enable();
					// this.registerForm.controls['Endereco'].enable();
					// this.registerForm.controls['Bairro'].enable();
					// this.registerForm.controls['Cidade'].enable();
					// this.registerForm.controls['Estado'].enable();
				},
			});

		// this.prevCepInputValue = cep;
	};
}
