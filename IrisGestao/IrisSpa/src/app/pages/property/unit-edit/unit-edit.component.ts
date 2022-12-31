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
import { ImovelUnidade, ImovelUnidadeType } from 'src/app/shared/models';
import { DominiosService, ImovelService } from 'src/app/shared/services';

import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-unit-edit',
	templateUrl: './unit-edit.component.html',
	styleUrls: ['./unit-edit.component.scss'],
})
export class UnitEditComponent implements OnInit {
	editForm: FormGroup;
	uid: string = '';
	isLoadingView: boolean = false;
	unit: ImovelUnidade;

	propertyGuid: string;
	isLoading = true;
	invalidGuid = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	unitTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private imovelService: ImovelService,
		private dominiosService: DominiosService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';
		});

		if (this.uid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.editForm = this.fb.group({
			propertyInfo: this.fb.group({
				proprietary: [{ value: '', disabled: true }],
				propertyName: [{ value: '', disabled: true }],
				category: [{ value: '', disabled: true }],
				typeStr: [{ value: '', disabled: true }],
			}),
			unitInfo: this.fb.group({
				type: ['', [Validators.required]],
				name: ['', Validators.required],
				areaTotal: ['', Validators.required],
				areaUsable: ['', Validators.required],
				areaOccupancy: ['', Validators.required],
				occupancy: ['', Validators.required],
				registration: ['', Validators.required],
				iptu: ['', Validators.required],
				neoenergia: ['', Validators.required],
				caesb: ['', Validators.required],
				administration: ['', Validators.required],
				potential: ['', Validators.required],
			}),
		});
	}

	ngOnInit(): void {
		this.getData();
	}

	get propertyInfoForm() {
		return this.editForm.controls['propertyInfo'] as FormGroup;
	}

	get editUnitForm() {
		return this.editForm.get('unitInfo') as FormGroup;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editUnitForm.controls;
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

	getData(): void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getUnit(this.uid)
			?.pipe(first())
			.subscribe({
				next: (unidade: ImovelUnidade) => {
					if (unidade) {
						this.unit = unidade;
						this.isLoadingView = false;
						this.propertyGuid = unidade.idImovelNavigation?.guidReferencia ?? '';

						this.propertyInfoForm.patchValue({
							proprietary : unidade.idImovelNavigation?.idClienteProprietarioNavigation?.nome,
							propertyName: unidade.idImovelNavigation?.nome,
							category: unidade.idImovelNavigation?.idCategoriaImovelNavigation?.nome,
							typeStr: unidade.idTipoUnidadeNavigation?.nome,
						});

						this.editUnitForm.patchValue({
							type: unidade.idTipoUnidadeNavigation?.id,
							name: unidade.tipo,
							areaTotal: unidade.areaTotal,
							areaUsable: unidade.areaUtil,
							areaOccupancy: unidade.areaHabitese,
							occupancy: unidade.matricula,
							registration: unidade.matricula,
							iptu: unidade.inscricaoIPTU,
							neoenergia: unidade.matriculaEnergia,
							caesb: unidade.matriculaAgua,
							administration: unidade.taxaAdministracao,
							potential: unidade.valorPotencial,
						});

						this.getListTypes();
					} else {
						this.invalidGuid = true;
					}
					this.isLoading = false;
				},
				error: () => {
					this.invalidGuid = true;
					this.isLoading = false;
				},
			});
	}

	saveChanges(): void {
		if (this.editUnitForm.invalid) {
			this.editUnitForm.markAllAsTouched();
			return;
		}

		this.isLoadingView = true;
		this.editUnitForm.disable();

		var data = {
			Tipo: this.editUnitForm.get('name')?.value,
			IdTipoUnidade: this.editUnitForm.get('type')?.value,
			AreaUtil: this.editUnitForm.get('areaUsable')?.value,
			AreaTotal: this.editUnitForm.get('areaTotal')?.value,
			AreaHabitese: this.editUnitForm.get('areaOccupancy')?.value,
			Matricula: this.editUnitForm.get('occupancy')?.value,
			InscricaoIptu: this.editUnitForm.get('iptu')?.value,
			MatriculaEnergia: this.editUnitForm.get('neoenergia')?.value,
			MatriculaAgua: this.editUnitForm.get('caesb')?.value,
			TaxaAdministracao: this.editUnitForm.get('administration')?.value,
			ValorPotencial: this.editUnitForm.get('potential')?.value,
			UnidadeLocada: this.unit.unidadeAlocada,
		} as ImovelUnidadeType;

		const save = this.imovelService
			.saveUnit(this.uid, data)
			?.pipe(first())
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

					this.editUnitForm.enable();
					this.isLoadingView = false;

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

	getListTypes() : void {
		this.dominiosService.getTipoUnidade().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.unitTypes.push({
						label: item.nome,
						value: item.id,
					});
				});

				this.editUnitForm.controls['type'].setValue(
					this.unit.idTipoUnidadeNavigation?.id ?? 1
				);
			}
		});
	}
}