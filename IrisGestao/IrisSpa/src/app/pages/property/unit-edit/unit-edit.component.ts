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
	ArquivoClassificacoes,
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

	docs: {
		projeto?: Base64Metadata;
		matricula?: Base64Metadata;
		habitese?: Base64Metadata;
	} = {};

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
						this.docs.projeto = {
							name: this.attachmentsObj.projeto.nome,
							mimetype: this.attachmentsObj.projeto.mimeType,
							data: this.attachmentsObj.projeto.local,
							isNew: false,
						};

					if (this.attachmentsObj?.matricula)
						this.docs.matricula = {
							name: this.attachmentsObj.matricula.nome,
							mimetype: this.attachmentsObj.matricula.mimeType,
							data: this.attachmentsObj.matricula.local,
							isNew: false,
						};

					if (this.attachmentsObj?.habitese)
						this.docs.habitese = {
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

		this.savePhotos();
		this.deletePhotos();
		this.saveDocs();
		this.deleteDocs();

		Promise.all([
			this.savePhotos(),
			this.deletePhotos(),
			this.saveDocs(),
			this.deleteDocs(),
		])
			.then((result) => {
				this.imovelService
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
								message: 'Erro no envio de dados do formulário',
								isError: true,
							};

							this.openModal();
						},
					});
			})
			.catch((error) => {
				console.error('Erro no envio do batch de anexos:', error);
				this.modalContent = {
					header: 'Atualização não realizada',
					message: 'Erro no envio de anexos',
					isError: true,
				};

				this.openModal();
			});
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

		return new Promise<{
			classificacao: ArquivoClassificacoes;
			response?: any;
			err?: any;
		}>((res, rej) => {
			this.anexoService
				.registerFile(this.propertyGuid, formData, 'foto')
				.pipe(first())
				.subscribe({
					next(response) {
						if (response.success) res({ classificacao: 'foto', response });
						else
							rej({ classificacao: 'foto', response, err: response.message });
					},
					error(err) {
						rej({ classificacao: 'foto', err });
					},
				});
		});
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
		const promises: Promise<{ response?: any; err?: any }>[] = [];

		this.deletedUnitPhotos.forEach((photoId) => {
			promises.push(
				new Promise((res, rej) => {
					this.anexoService
						.deleteFile(photoId)
						.pipe(first())
						.subscribe({
							next(response) {
								if (response.success) res({ response });
								else rej({ response, err: response.message });
							},
							error(err) {
								rej({ err });
							},
						});
				})
			);
		});

		return Promise.all(promises);
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
				this.docs.projeto = {
					name: file.name,
					mimetype: file.type,
					data: file,
					isNew: true,
				};
				this.deletedDocs.projeto = false;
				break;

			case 'matricula':
				this.docs.matricula = {
					name: file.name,
					mimetype: file.type,
					data: file,
					isNew: true,
				};
				this.deletedDocs.matricula = false;
				break;

			case 'habitese':
				this.docs.habitese = {
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
		const promises: Promise<{
			classificacao: ArquivoClassificacoes;
			response?: any;
			err?: any;
		}>[] = [];

		const saveDoc = (classificacao: 'projeto' | 'matricula' | 'habitese') => {
			if (
				!this.deletedDocs[classificacao] &&
				this.docs[classificacao] &&
				this.docs[classificacao]!.isNew &&
				this.docs[classificacao]!.data !== null
			) {
				const formData = new FormData();

				console.debug('adding file of class', classificacao);

				promises.push(
					new Promise((res, rej) => {
						if (this.docs[classificacao] && this.docs[classificacao]!.data) {
							if (!(this.docs[classificacao]!.data instanceof File)) {
								Utils.dataUrlToFile(
									//@ts-ignore
									this.docs[classificacao]!.data,
									this.docs[classificacao]!.name,
									this.docs[classificacao]!.mimetype
								)
									.then((file) => {
										formData.append('files', file);
										// this.anexoService
										// 	.registerFile(this.propertyGuid, formData, classificacao)
										// 	.subscribe();

										console.debug('creating file');

										const registerUpdatePromise =
											this.anexoService.registerUpdateFile(
												this.attachmentsObj,
												this.propertyGuid,
												formData,
												classificacao
											);

										if (registerUpdatePromise)
											registerUpdatePromise
												.then((obj) => {
													if (obj === null) return rej(obj);

													if (obj?.err) {
														rej(obj);
													}

													if (obj.response.success) res(obj);
													else rej(obj);
												})
												.catch((err) => {
													console.error('1. Erro ao atualizar anexos');
													rej({ err });
												});
									})
									.catch((err) => {
										console.error('2. Erro ao atualizar anexos');
										rej({ err });
									});
							} else {
								// @ts-ignore
								formData.append('files', this.docs[classificacao]!.data);
								// this.anexoService
								// 	.registerFile(this.propertyGuid, formData, classificacao)
								// 	.subscribe();
								this.anexoService
									.registerUpdateFile(
										this.attachmentsObj,
										this.propertyGuid,
										formData,
										classificacao
									)
									?.then((obj) => {
										if (obj === null) return;

										if (obj?.err) {
											rej(obj);
										}

										if (obj.response.success) res(obj);
										else rej(obj);
									})
									.catch((err) => {
										console.error('2. Erro ao atualizar anexos');
										rej({ err });
									});
							}
						}
					})
				);
			}
		};

		saveDoc('projeto');
		saveDoc('matricula');
		saveDoc('habitese');

		return Promise.all(promises);
	}

	removeDoc(doc: 'projeto' | 'matricula' | 'habitese') {
		this.deletedDocs[doc] = true;
	}

	deleteDocs() {
		const promises: Promise<{ response?: any; err?: any }>[] = [];

		promises.concat(
			(
				['projeto', 'matricula', 'habitese'] as [
					'projeto',
					'matricula',
					'habitese'
				]
			).map((classificacao) => {
				return new Promise((res, rej) => {
					if (
						this.deletedDocs[classificacao] &&
						this.attachmentsObj?.[classificacao]
					) {
						console.debug(
							'deleting doc',
							this.attachmentsObj[classificacao]!.id
						);
						this.anexoService
							.deleteFile(this.attachmentsObj[classificacao]!.id)
							.pipe(first())
							.subscribe({
								next(response) {
									if (response.success) res({ response });
									else rej({ response, err: response.message });
								},
								error(err) {
									rej({ err });
								},
							});
					}
				});
			})
		);

		return Promise.all(promises);
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
