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
import {
	AnexoService,
	Attachment,
} from 'src/app/shared/services/anexo.service';

import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

type Base64Metadata = {
	name: string;
	data: File | string | ArrayBuffer | null;
	mimetype: string;
	isNew?: boolean;
	id?: number | string;
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

	propertyAttachments: {
		capa: Attachment | undefined;
		projeto: Attachment | undefined;
		matricula: Attachment | undefined;
		habitese: Attachment | undefined;
	};

	attachmentsObj:
		| Partial<{
				capa: Attachment;
				foto: Attachment[];
				habitese: Attachment;
				projeto: Attachment;
				matricula: Attachment;
				outrosdocs: Attachment[];
		  }>
		| undefined;

	docProjeto: Base64Metadata;
	docMatricula: Base64Metadata;
	docHabitese: Base64Metadata;

	deletedDocs = {
		projeto: false,
		matricula: false,
		habitese: false,
	};

	unitPhotos: Base64Metadata[] = [];

	addedUnitPhotos: Base64Metadata[] = [];

	deletedUnitPhotos: number[] = [];

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,
		private imovelService: ImovelService,
		private dominiosService: DominiosService,
		private anexoService: AnexoService
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
				// occupancy: ['', Validators.required],
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

		this.anexoService
			.getFiles(this.uid)
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.attachmentsObj = {
						capa: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'capa'
						),
						foto: event?.filter(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'foto'
						),
						habitese: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'habitese'
						),
						projeto: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'projeto'
						),
						matricula: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'matricula'
						),
						outrosdocs: event?.filter(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'outrosdocs'
						),
					};

					console.debug('attachmentsObj', this.attachmentsObj);

					if (this.attachmentsObj?.foto?.length)
						this.unitPhotos = this.attachmentsObj.foto.map((foto) => {
							return {
								name: foto.nome,
								mimetype: foto.mimeType,
								data: foto.local,
								id: foto.id,
							};
						});

					if (this.attachmentsObj?.projeto)
						this.docProjeto = {
							name: this.attachmentsObj.projeto.nome,
							mimetype: this.attachmentsObj.projeto.mimeType,
							data: this.attachmentsObj.projeto.local,
							isNew: false,
						};

					if (this.attachmentsObj?.matricula)
						this.docMatricula = {
							name: this.attachmentsObj.matricula.nome,
							mimetype: this.attachmentsObj.matricula.mimeType,
							data: this.attachmentsObj.matricula.local,
							isNew: false,
						};

					if (this.attachmentsObj?.habitese)
						this.docHabitese = {
							name: this.attachmentsObj.habitese.nome,
							mimetype: this.attachmentsObj.habitese.mimeType,
							data: this.attachmentsObj.habitese.local,
							isNew: false,
						};
				},
				error: (error) => {
					console.error('Erro: ', error);
				},
			});
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
						this.propertyGuid =
							unidade.idImovelNavigation?.guidReferencia ?? '';

						this.getPropertyAttachments();

						this.propertyInfoForm.patchValue({
							proprietary:
								unidade.idImovelNavigation?.idClienteProprietarioNavigation
									?.nome,
							propertyName: unidade.idImovelNavigation?.nome,
							category:
								unidade.idImovelNavigation?.idCategoriaImovelNavigation?.nome,
							typeStr: unidade.idTipoUnidadeNavigation?.nome,
						});

						this.editUnitForm.patchValue({
							type: unidade.idTipoUnidadeNavigation?.id,
							name: unidade.tipo,
							areaTotal: unidade.areaTotal,
							areaUsable: unidade.areaUtil,
							areaOccupancy: unidade.areaHabitese,
							// occupancy: unidade.matricula,
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

	getPropertyAttachments() {
		this.anexoService
			.getFiles(this.propertyGuid)
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.propertyAttachments = {
						capa: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'capa'
						),
						habitese: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'habitese'
						),
						projeto: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'projeto'
						),
						matricula: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'matricula'
						),
					};

					console.log(this.propertyAttachments);
				},
				error: (error) => {
					console.error('Erro: ', error);
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
			Matricula: this.editUnitForm.get('registration')?.value,
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

		this.savePhotos();
		this.deletePhotos();
		this.saveDocs();
		this.deleteDocs();
	}

	addPhoto(event: any) {
		const files = event.target.files;

		const base64promises = [...files].map((file: File) => {
			return Utils.fileToDataUrl(file);
		});

		Promise.all(base64promises).then((base64files) => {
			base64files.forEach((base64file) => {
				this.addedUnitPhotos.push(base64file);
			});
		});
	}

	async savePhotos() {
		if (this.addedUnitPhotos.length === 0) return;

		const filesPromises = this.addedUnitPhotos.map((file) => {
			return Utils.dataUrlToFile(file.data as string, file.name, file.mimetype);
		});

		const files = await Promise.all(filesPromises);

		const formData = new FormData();

		files.forEach((file) => {
			formData.append('files', file);
		});

		console.debug('sending', formData);

		this.anexoService.registerFile(this.uid, formData, 'foto').subscribe();
	}

	removePhoto(index: number, newPhoto = false) {
		if (newPhoto) {
			this.addedUnitPhotos.splice(index, 1);
			return;
		}

		const removedId: number = this.unitPhotos.splice(index, 1)[0].id as number;
		this.deletedUnitPhotos.push(removedId);
	}

	deletePhotos() {
		this.deletedUnitPhotos.forEach((photoId) => {
			this.anexoService.deleteFile(photoId).subscribe();
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

	getListTypes(): void {
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

	addDoc(event: Event, type: 'projeto' | 'matricula' | 'habitese') {
		const file = (event?.target as HTMLInputElement)?.files?.[0];

		if (!file) return;

		switch (type) {
			case 'projeto':
				this.docProjeto = {
					name: file.name,
					mimetype: file.type,
					data: file,
					isNew: true,
				};
				this.deletedDocs.projeto = false;
				break;

			case 'matricula':
				this.docMatricula = {
					name: file.name,
					mimetype: file.type,
					data: file,
					isNew: true,
				};
				this.deletedDocs.matricula = false;
				break;

			case 'habitese':
				this.docHabitese = {
					name: file.name,
					mimetype: file.type,
					data: file,
					isNew: true,
				};
				this.deletedDocs.habitese = false;
				break;

			default:
				break;
		}
	}

	saveDocs() {
		if (
			!this.deletedDocs.projeto &&
			this.docProjeto &&
			this.docProjeto.isNew &&
			this.docProjeto.data !== null
		) {
			const classificacao = 'projeto';
			const formData = new FormData();

			if (!(this.docProjeto.data instanceof File)) {
				Utils.dataUrlToFile(
					this.docProjeto.data,
					this.docProjeto.name,
					this.docProjeto.mimetype
				).then((file) => {
					formData.append('files', file);
					this.anexoService
						.registerFile(this.uid, formData, classificacao)
						.subscribe();
				});
			} else {
				formData.append('files', this.docProjeto.data);
				this.anexoService
					.registerFile(this.uid, formData, classificacao)
					.subscribe();
			}
		}

		if (
			!this.deletedDocs.matricula &&
			this.docMatricula &&
			this.docMatricula.isNew &&
			this.docMatricula.data !== null
		) {
			const classificacao = 'matricula';
			const formData = new FormData();

			if (!(this.docMatricula.data instanceof File)) {
				Utils.dataUrlToFile(
					this.docMatricula.data,
					this.docMatricula.name,
					this.docMatricula.mimetype
				).then((file) => {
					formData.append('files', file);
					this.anexoService
						.registerFile(this.uid, formData, classificacao)
						.subscribe();
				});
			} else {
				formData.append('files', this.docMatricula.data);
				this.anexoService
					.registerFile(this.uid, formData, classificacao)
					.subscribe();
			}
		}

		if (
			!this.deletedDocs.habitese &&
			this.docHabitese &&
			this.docHabitese.isNew &&
			this.docHabitese.data !== null
		) {
			const classificacao = 'habitese';
			const formData = new FormData();

			if (!(this.docHabitese.data instanceof File)) {
				Utils.dataUrlToFile(
					this.docHabitese.data,
					this.docHabitese.name,
					this.docHabitese.mimetype
				).then((file) => {
					formData.append('files', file);
					this.anexoService
						.registerFile(this.uid, formData, classificacao)
						.subscribe();
				});
			} else {
				formData.append('files', this.docHabitese.data);
				this.anexoService
					.registerFile(this.uid, formData, classificacao)
					.subscribe();
			}
		}
	}

	removeDoc(doc: 'projeto' | 'matricula' | 'habitese') {
		this.deletedDocs[doc] = true;
	}

	deleteDocs() {
		if (this.deletedDocs.projeto && this.attachmentsObj?.projeto) {
			console.debug('deleting doc', this.attachmentsObj.projeto.id);
			this.anexoService.deleteFile(this.attachmentsObj.projeto.id).subscribe();
		}

		if (this.deletedDocs.matricula && this.attachmentsObj?.matricula) {
			console.debug('deleting doc', this.attachmentsObj.matricula.id);
			this.anexoService
				.deleteFile(this.attachmentsObj.matricula.id)
				.subscribe();
		}

		if (this.deletedDocs.habitese && this.attachmentsObj?.habitese) {
			console.debug('deleting doc', this.attachmentsObj.habitese.id);
			this.anexoService.deleteFile(this.attachmentsObj.habitese.id).subscribe();
		}
	}

	async downloadFile(
		file: File | string | ArrayBuffer | null,
		filename: string
	) {
		if (file instanceof File) {
			file = (await Utils.fileToDataUrl(file)).data;
		}

		if (file === null) return;

		Utils.saveAs(file, filename);
	}
}
