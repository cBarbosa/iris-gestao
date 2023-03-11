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
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import {
	AnexoService,
	ArquivoClassificacoes,
} from 'src/app/shared/services/anexo.service';
import { Attachment } from 'src/app/shared/services/anexo.service';
import { ApiResponse } from 'src/app/shared/models';

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
	selector: 'app-property-edit',
	templateUrl: './property-edit.component.html',
	styleUrls: ['./property-edit.component.scss'],
})
export class PropertyEditComponent {
	editForm: FormGroup;

	propertyGuid: string;
	isLoading = true;
	invalidGuid = false;

	imovelObj: any = null;

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

	// docProjeto: Base64Metadata;
	// docMatricula: Base64Metadata;
	// docHabitese: Base64Metadata;

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

	propertyPhotos: Base64Metadata[] = [];

	addedPropertyPhotos: Base64Metadata[] = [];

	deletedPropertyPhotos: number[] = [];

	// CAPA
	displayCropModal = false;
	defaultCoverImage: string | null = null;

	imageChangedEvent: any = '';
	croppedCover: any = null;

	fileChangeEvent(event: any): void {
		this.displayCropModal = true;

		this.imageChangedEvent = event;
	}
	//Emits an ImageCroppedEvent each time the image is cropped
	imageCropped(event: ImageCroppedEvent) {
		this.croppedCover = event.base64;
	}
	//Emits the LoadedImage when it was loaded into the cropper
	imageLoaded(image?: LoadedImage) {
		// show cropper
		console.log(image);
	}
	//Emits when the cropper is ready to be interacted. The Dimensions object that is returned contains the displayed image size
	cropperReady(dimensions?: any) {
		// cropper ready
	}
	//Emits when a wrong file type was selected (only png, gif and jpg are allowed)
	loadImageFailed() {
		// show message
		console.error('Erro ao cortar imagem');
	}

	closeCropModal() {
		this.displayCropModal = false;
	}
	openCropModal() {
		this.imageChangedEvent = null;
		this.croppedCover = null;
		this.displayCropModal = true;
	}

	// FIM CAPA

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private imovelService: ImovelService,
		private activatedRoute: ActivatedRoute,
		private commonService: CommonService,
		private anexoService: AnexoService,
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
				this.imovelObj = event;

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

		this.anexoService
			.getFiles(this.propertyGuid)
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

					if (this.attachmentsObj?.capa)
						this.defaultCoverImage = this.attachmentsObj.capa.local;

					if (this.attachmentsObj?.foto?.length)
						this.propertyPhotos = this.attachmentsObj.foto.map((foto) => {
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

		// this.deletePhotos();
		// this.deleteDocs();
		// this.saveCover();
		// this.savePhotos();
		// this.saveDocs();

		Promise.all([
			this.deletePhotos(),
			this.deleteDocs(),
			this.saveCover(),
			this.savePhotos(),
			this.saveDocs(),
		])
			.then((result) => {
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
					message:
						error.err?.err ??
						error.err ??
						'Os arquivos podem estar com o mesmo nome. Para corrigir verifique os arquivos e teste novamente.',
					isError: true,
				};

				this.openModal();
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

	async saveCover() {
		if (this.croppedCover === null) return;

		const coverFile = await Utils.dataUrlToFile(
			this.croppedCover,
			`${this.imovelObj?.nome ?? 'imovel'}-cover.png`,
			'image/png'
		);

		const formData = new FormData();
		formData.append('files', coverFile);

		console.debug('sending', formData);

		return new Promise<{
			classificacao: ArquivoClassificacoes;
			response?: any;
			err?: any;
		}>((res, rej) => {
			if (this.attachmentsObj?.capa != null) {
				this.anexoService
					.updateFile(
						this.attachmentsObj.capa.id,
						this.propertyGuid,
						formData,
						'capa'
					)
					.then((response) => {
						res(response);
					})
					.catch((err) => {
						rej(err);
					});
				console.debug('updating');
			} else {
				this.anexoService
					.registerFile(this.propertyGuid, formData, 'capa')
					.pipe(first())
					.subscribe({
						next(response) {
							res({ classificacao: 'capa', response });
						},
						error(err) {
							rej({ classificacao: 'capa', err });
						},
					});
			}
		});
	}

	addPhoto(event: any) {
		const files = event.target.files;

		const base64promises = [...files].map((file: File) => {
			return Utils.fileToDataUrl(file);
		});

		Promise.all(base64promises).then((base64files) => {
			base64files.forEach((base64file) => {
				this.addedPropertyPhotos.push(base64file);
			});
		});
	}

	async savePhotos() {
		if (this.addedPropertyPhotos.length === 0) return;

		const filesPromises = this.addedPropertyPhotos.map((file) => {
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
			this.addedPropertyPhotos.splice(index, 1);
			return;
		}

		const removedId: number = this.propertyPhotos.splice(index, 1)[0]
			.id as number;
		this.deletedPropertyPhotos.push(removedId);
	}

	deletePhotos() {
		const promises: Promise<{ response?: any; err?: any }>[] = [];

		this.deletedPropertyPhotos.forEach((photoId) => {
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
