import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { Imovel, ImovelUnidade, ImovelUnidadeType } from 'src/app/shared/models';
import { DominiosService, ImovelService } from 'src/app/shared/services';

import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-unit-register',
	templateUrl: './unit-register.component.html',
	styleUrls: ['./unit-register.component.scss'],
})
export class UnitRegisterComponent implements OnInit {
	editForm: FormGroup;
	uid: string = '';
	isLoadingView: boolean = false;
	property: Imovel;
	unitTypes: DropdownItem[] = [
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
		private route: ActivatedRoute,
		private location: Location,
		private imovelService: ImovelService,
		private dominiosService: DominiosService,
		private router: Router
	) {

    this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';
		});

		this.editForm = this.fb.group({
			name: ['', Validators.required],
			nameCompany: [''],
			category: [''],
			type: ['', [Validators.required]],
			typeStr: [''],
			proprietary: ['', [Validators.required]],
			area_total: [''],
			area_usable: [''],
			area_occupancy: [''],
			occupancy: [''],
			iptu: [''],
			neoenergia: [''],
			caesb: [''],
			administration: [''],
			potential: [''],
		});
	}

	ngOnInit(): void {
		this.getData();
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: any = null) {
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			// Object.keys(this.proposalForm.controls).forEach(key => {
			// 	this.proposalForm.get(key)?.markAsDirty()
			// })
			return;
		}

		this.saveChanges();
	}

	goBack() {
		this.location.back();
	}

	saveChanges(): void {
		this.isLoadingView = true;

		var data = {
			IdTipoUnidade: this.editForm.get('type')?.value,
			Tipo: this.editForm.get('name')?.value,
			AreaUtil: this.editForm.get('area_usable')?.value,
			AreaTotal: this.editForm.get('area_total')?.value,
			AreaHabitese: this.editForm.get('area_occupancy')?.value,
			Matricula: this.editForm.get('occupancy')?.value,
			InscricaoIptu: this.editForm.get('iptu')?.value,
			MatriculaEnergia: this.editForm.get('neoenergia')?.value,
			MatriculaAgua: this.editForm.get('caesb')?.value,
			TaxaAdministracao: this.editForm.get('administration')?.value,
			ValorPotencial: this.editForm.get('potential')?.value,
			UnidadeLocada: false,
		} as ImovelUnidadeType;

		const newi = this.imovelService
			.createUnit(this.uid, data)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Cadastro realizado com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Cadastro não realizada',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
					this.isLoadingView = false;
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Cadastro não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
					this.isLoadingView = false;
				},
			});
	}

  getData(): void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getProperty(this.uid)
			?.pipe(first())
			.subscribe((imovel: Imovel) => {

				this.property = imovel;
				this.isLoadingView = false;

				this.editForm.patchValue({
					nameCompany: imovel.nome,
					category: imovel.idCategoriaImovelNavigation?.nome,
					type: imovel.unidade?.[0]?.idTipoUnidadeNavigation?.id,
					typeStr: imovel.unidade?.[0]?.idTipoUnidadeNavigation?.nome,
					proprietary: imovel.idClienteProprietarioNavigation?.nome,
				});

				this.isLoadingView = false;

				this.getListTypes();
			});
	}

	getListTypes() : void {
		this.dominiosService.getTipoUnidade().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.unitTypes.push({
						label: item.nome,
						value: item.id,
					});
				});
				this.editForm.controls['type'].setValue(
					this.property?.unidade?.[0]?.idTipoUnidadeNavigation?.id ?? null
				);
			}
		});
	}

	openModal() {
		console.log('openning modal');
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
