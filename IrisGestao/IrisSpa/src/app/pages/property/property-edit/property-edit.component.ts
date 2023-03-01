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
	CommonService,
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

	prevCepInputValue = '';
	isLoadingCep = false;

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
			street: [null, [Validators.required]],
			neighborhood: [null, [Validators.required]],
			city: [null, [Validators.required]],
			state: [null, [Validators.required]],
		});

		this.imovelService.getProperty(this.propertyGuid).subscribe((event) => {
			if (event) {
				const cep = event?.imovelEndereco[0]?.cep.toString() ?? '';
				const formatedCep = `${cep.slice(0, 2)}.${cep.slice(2, 5)}-${cep.slice(
					5
				)}`;
				this.prevCepInputValue = formatedCep;

				this.editForm.controls['proprietary'].setValue(
					event?.idClienteProprietarioNavigation?.id
				);
				this.editForm.controls['name'].setValue(event?.nome);
				this.editForm.controls['category'].setValue(
					event?.idCategoriaImovelNavigation?.id
				);
				this.editForm.controls['costCentre'].setValue(event?.numCentroCusto);
				this.editForm.controls['zipcode'].setValue(formatedCep);
				this.editForm.controls['street'].setValue(
					event?.imovelEndereco[0]?.rua
				);
				this.editForm.controls['state'].setValue(event?.imovelEndereco[0]?.uf);
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
			CEP: +editFormData.zipcode.replace(/\D/g, ''),
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

	getListaProprietarios(): void {
		this.clienteService.getListaProprietarios().subscribe((event) => {
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

	getListaCategorias(): void {
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
	}

	setAddressByCEP(e: any) {
		const cep = e.target.value.replace(/\D/g, '');

		if (cep.length !== 8 || e.target.value === this.prevCepInputValue) {
			this.prevCepInputValue = e.target.value;
			return;
		}

		this.isLoadingCep = true;
		this.editForm.controls['zipcode'].disable();
		this.editForm.controls['street'].disable();
		this.editForm.controls['neighborhood'].disable();
		this.editForm.controls['city'].disable();
		this.editForm.controls['state'].disable();

		this.commonService
			.getAddressByCEP(cep)
			.pipe(first())
			.subscribe({
				next: (event) => {
					if (event.success) {
						if (event.data.resultado === '1') {
							this.editForm.patchValue({
								street: event.data.logradouro,
								city: event.data.cidade,
								neighborhood: event.data.bairro,
								state: event.data.uf,
							});
						}
					}

					this.isLoadingCep = false;
					this.editForm.controls['zipcode'].enable();
					this.editForm.controls['street'].enable();
					this.editForm.controls['neighborhood'].enable();
					this.editForm.controls['city'].enable();
					this.editForm.controls['state'].enable();
				},
				error: (err) => {
					console.error(err);

					this.isLoadingCep = false;
					this.editForm.controls['zipcode'].enable();
					this.editForm.controls['street'].enable();
					this.editForm.controls['neighborhood'].enable();
					this.editForm.controls['city'].enable();
					this.editForm.controls['state'].enable();
				},
			});

		this.prevCepInputValue = e.target.value;
	}
}
