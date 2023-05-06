import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ImovelService } from '../../services';
import { DropdownItem } from '../../models/types';
import { Utils } from '../../utils';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

export type LinkedProperty = {
	nome: string;
	guid: string;
	tipo: string;
	unidades: {
		guid: string;
		name: string;
	}[];
};

@Component({
	selector: 'app-link-property',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		SidebarModule,
		DropdownModule,
		MultiSelectModule,
		ButtonModule,
	],
	templateUrl: './link-property.component.html',
	styleUrls: ['./link-property.component.scss'],
})
export class LinkPropertyComponent {
	@Input()
	multiple = false;

	@Input()
	required = true;

	@Input()
	linkedProperties: LinkedProperty[] = [];

	@Output()
	selectEvent = new EventEmitter<LinkedProperty | LinkedProperty[]>();

	propertyAddForm: FormGroup;

	linkedPropertiesInvalid = false;
	editingLinkedProperty: string | null = null;
	propertyAddVisible = false;

	buildings: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	buildingsList: DropdownItem[] = [];

	units: DropdownItem[] = [];

	constructor(private fb: FormBuilder, private imovelService: ImovelService) {}

	ngOnInit() {
		this.propertyAddForm = this.fb.group({
			edificio: [null, Validators.required],
			unidade: [null, [Validators.required]],
		});

		this.propertyAddForm.controls['unidade'].disable();

		this.imovelService.getProperties(100, 1).subscribe((event) => {
			if (event) {
				event.data.items.forEach((item: any) => {
					this.buildings.push({
						label: item.nome,
						value: {
							guid: item.guidReferencia,
							name: item.nome,
						},
						units: item.unidade,
					});
				});
				console.log(this.buildings);
				this.setBuildingsList();
			}
		});
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.propertyAddForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	// get buildingsList() {
	// 	const buildingList = this.buildings.filter((building) => {
	// 		if (this.editingLinkedProperty === building.value?.guid) return true;
	// 		return !this.linkedProperties.some((linked) => {
	// 			return building.value?.guid === linked.guid;
	// 		});
	// 	});
	// 	console.log('>>>', buildingList);
	// 	return buildingList;
	// }

	setBuildingsList() {
		const list = this.buildings.filter((building) => {
			if (this.editingLinkedProperty === building.value?.guid) return true;
			return !this.linkedProperties.some((linked) => {
				return building.value?.guid === linked.guid;
			});
		});
		this.buildingsList = list;
		return list;
	}

	onProprietarySubmit(e: any = null) {
		const formData: {
			edificio: {
				guid: string;
				name: string;
			};
			unidade: {
				guid: string;
				name: string;
			}[];
		} = this.propertyAddForm.getRawValue();

		if (this.editingLinkedProperty === null) {
			const isDuplicate = this.linkedProperties.some(({ unidades }) => {
				return unidades.some(({ guid: linkedGuid }) => {
					return formData.unidade.some(({ guid }) => linkedGuid === guid);
				});
			});

			if (!isDuplicate) {
				this.linkedProperties.push({
					nome: formData.edificio.name,
					guid: formData.edificio.guid,
					tipo: 'Edifício Coorporativo',
					unidades: formData.unidade,
				});
			}
		} else {
			const index = this.linkedProperties.findIndex(
				(p) => p.guid === this.editingLinkedProperty
			);

			this.linkedProperties.splice(index, 1, {
				nome: formData.edificio.name,
				guid: formData.edificio.guid,
				tipo: 'Edifício Coorporativo',
				unidades: formData.unidade,
			});

			this.linkedProperties = [...this.linkedProperties];
		}

		if (this.linkedProperties.length !== 0) {
			this.linkedPropertiesInvalid = false;
		}

		this.propertyAddForm.reset();

		this.selectEvent.emit(this.linkedProperties);

		this.hideAddProperty();
	}

	onChangeBuilding(event: any) {
		const building = this.buildings.find((b) => b.value?.guid === event?.guid);

		if (building?.value !== null)
			this.propertyAddForm.controls['unidade'].enable();
		else this.propertyAddForm.controls['unidade'].disable();

		this.propertyAddForm.controls['unidade'].setValue(null);

		this.units = [];

		building?.['units']?.forEach((item: any) => {
			this.units.push({
				label: item.tipo,
				value: {
					guid: item.guidReferencia,
					name: item.tipo,
				},
			});
		});
	}

	updateLinkedPropertiesValidity() {
		if (this.linkedProperties.length === 0 && this.required)
			this.linkedPropertiesInvalid = true;
		else this.linkedPropertiesInvalid = false;
	}

	removeLinkedProperty(guid: string) {
		const index = this.linkedProperties.findIndex((p) => p.guid === guid);

		const linked = [...this.linkedProperties];

		linked.splice(index, 1);

		this.selectEvent.emit(linked);

		this.linkedProperties = linked;

		this.updateLinkedPropertiesValidity();

		console.log('linked', this.linkedProperties);
	}

	editLinkedProperty(property: any) {
		this.propertyAddForm.patchValue({
			edificio: {
				name: property.nome,
				guid: property.guid,
			},
			unidade: property.unidades,
		});

		const building = this.buildings.find(
			(b) => b.value?.guid === property.guid
		);

		this.propertyAddForm.controls['unidade'].enable();

		this.propertyAddForm.controls['unidade'].setValue([]);

		this.units = [];

		building?.['units']?.forEach((item: any) => {
			const value = {
				guid: item.guidReferencia,
				name: item.tipo,
			};

			this.units.push({
				label: item.tipo,
				value: value,
			});

			if (property.unidades.some((u: any) => u.guid === item.guidReferencia)) {
				this.propertyAddForm.controls['unidade'].setValue([
					...this.propertyAddForm.controls['unidade'].value,
					value,
				]);
			}
		});

		this.editingLinkedProperty = property.guid;
		this.showAddProperty();
	}

	resetLinkedProperties() {
		this.linkedProperties = [];

		this.selectEvent.emit(this.linkedProperties);
	}

	showAddProperty() {
		this.propertyAddVisible = true;
	}

	hideAddProperty = () => {
		this.editingLinkedProperty = null;
		this.propertyAddForm.patchValue({
			edificio: null,
			unidade: null,
		});
		this.propertyAddVisible = false;
	};
}
