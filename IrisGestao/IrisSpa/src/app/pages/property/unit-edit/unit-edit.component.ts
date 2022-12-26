import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { ImovelUnidade, ImovelUnidadeType } from 'src/app/shared/models';
import { ImovelService } from 'src/app/shared/services';

import { Utils } from 'src/app/shared/utils';

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

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private location: Location,
		private imovelService: ImovelService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';
		});

		this.editForm = this.fb.group({
			name: ['', Validators.required],
			category: ['', [Validators.required]],
			type: ['', [Validators.required]],
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

	getData(): void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getUnit(this.uid)
			?.pipe(first())
			.subscribe((unidade: ImovelUnidade) => {
				this.unit = unidade;
				this.isLoadingView = false;

				this.editForm.patchValue({
					name: unidade.tipo,
					category:
						unidade.idImovelNavigation?.idCategoriaImovelNavigation?.nome,
					type: unidade.idTipoUnidadeNavigation?.nome,
					proprietary:
						unidade.idImovelNavigation?.idClienteProprietarioNavigation?.nome,
					area_total: unidade.areaTotal,
					area_usable: unidade.areaUtil,
					area_occupancy: unidade.areaHabitese,
					occupancy: unidade.matricula,
					iptu: unidade.inscricaoIPTU,
					neoenergia: unidade.matriculaEnergia,
					caesb: unidade.matriculaAgua,
					administration: unidade.taxaAdministracao,
					potential: unidade.valorPotencial,
				});
			});
	}

	saveChanges(): void {
		this.isLoadingView = true;

		const save = this.imovelService
			.saveUnit(this.uid, {
				Tipo: this.editForm.get('name')?.value,
				IdTipoUnidade: this.unit.idTipoUnidadeNavigation?.id,
				AreaUtil: this.editForm.get('area_usable')?.value,
				AreaTotal: this.editForm.get('area_total')?.value,
				AreaHabitese: this.editForm.get('area_occupancy')?.value,
				Matricula: this.editForm.get('occupancy')?.value,
				InscricaoIptu: this.editForm.get('iptu')?.value,
				MatriculaEnergia: this.editForm.get('neoenergia')?.value,
				MatriculaAgua: this.editForm.get('caesb')?.value,
				TaxaAdministracao: this.editForm.get('administration')?.value,
				ValorPotencial: this.editForm.get('potential')?.value,
				UnidadeLocada: this.unit.unidadeAlocada,
			} as ImovelUnidadeType)
			?.pipe(first())
			.subscribe((response: ImovelUnidade) => {
				window.alert('Dados atualizados com sucesso');
				this.isLoadingView = false;
				this.goBack();
			});
	}
}
