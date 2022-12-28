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

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private imovelService: ImovelService,
		private activatedRoute: ActivatedRoute,
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
		});

		this.imovelService.getProperty(this.propertyGuid).subscribe((event) => {
			if (event) {
				this.editForm.controls['proprietary'].setValue(
					event?.idClienteProprietarioNavigation?.id
				);
				this.editForm.controls['name'].setValue(event?.nome);
				this.editForm.controls['category'].setValue(
					event?.idCategoriaImovelNavigation?.id
				);
				this.editForm.controls['costCentre'].setValue(event?.numCentroCusto);

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
			Classificacao: '5',
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
	}
}
