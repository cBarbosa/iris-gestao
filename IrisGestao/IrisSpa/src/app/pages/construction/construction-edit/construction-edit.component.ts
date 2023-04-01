import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstructionService } from 'src/app/shared/services/construcao.service';
import {
	AnexoService,
	ArquivoClassificacoes,
	Attachment,
} from 'src/app/shared/services/anexo.service';
import { Utils } from 'src/app/shared/utils';
import { first } from 'rxjs';

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
	selector: 'app-construction-edit',
	templateUrl: './construction-edit.component.html',
	styleUrls: ['./construction-edit.component.scss'],
})
export class ConstructionEditComponent {
	editForm: FormGroup;

	constructionGuid: string;
	isLoading = false;
	invalidGuid = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	onInputDate: Function;
	onBlurDate: Function;

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

	constructionPhotos: Base64Metadata[] = [];

	addedConstructionPhotos: Base64Metadata[] = [];

	deletedConstructionPhotos: number[] = [];

	opcoesPorcentagemConclusao: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private constructionService: ConstructionService,
		private anexoService: AnexoService
	) {}

	ngOnInit() {
		const constructionGuid = this.activatedRoute.snapshot.paramMap.get('guid');

		if (constructionGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.constructionGuid = constructionGuid;

		this.editForm = this.fb.group({
			constructionInfo: this.fb.group({
				nome: ['', Validators.required],
				dataInicio: [null, [Validators.required]],
				dataFim: [null, [Validators.required]],
				valorOrcamento: [null, [Validators.required]],
				porcentagemConclusao: [null, Validators.required],
			}),
			attachments: this.fb.group({
				projeto: [null, [Validators.required]],
				matricula: [null, [Validators.required]],
				habitese: [null, [Validators.required]],
			}),
			photos: this.fb.group({}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.constructionService
			.getConstructionByGuid(this.constructionGuid)
			.subscribe((event: any) => {
				if (event) {
					const data = event.data[0];
					console.log(data);

					this.editForm.controls['constructionInfo'].patchValue({
						nome: data.nomeObra,
						dataInicio: new Date(data.dataInicio),
						dataFim: new Date(data.dataFim),
						valorOrcamento: data.orcamento,
						porcentagemConclusao: data.porcentagemConclusao,
					});
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
			});

		this.anexoService
			.getFiles(this.constructionGuid)
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

					// if (this.attachmentsObj?.capa)
					// 	this.defaultCoverImage = this.attachmentsObj.capa.local;

					if (this.attachmentsObj?.foto?.length)
						this.constructionPhotos = this.attachmentsObj.foto.map((foto) => {
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

	get constructionInfo() {
		return (this.editForm.controls['constructionInfo'] as FormGroup).controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	/* DOC UPLOAD */

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
										// 	.registerFile(this.constructionGuid, formData, classificacao)
										// 	.subscribe();

										console.debug('creating file');

										const registerUpdatePromise =
											this.anexoService.registerUpdateFile(
												this.attachmentsObj,
												this.constructionGuid,
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
								// 	.registerFile(this.constructionGuid, formData, classificacao)
								// 	.subscribe();
								this.anexoService
									.registerUpdateFile(
										this.attachmentsObj,
										this.constructionGuid,
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

	/* END DOC UPLOAD */

	/* PHOTO UPLOAD */

	addPhoto(event: any) {
		const files = event.target.files;

		const base64promises = [...files].map((file: File) => {
			return Utils.fileToDataUrl(file);
		});

		Promise.all(base64promises).then((base64files) => {
			base64files.forEach((base64file) => {
				this.addedConstructionPhotos.push(base64file);
			});
		});
	}

	async savePhotos() {
		if (this.addedConstructionPhotos.length === 0) return;

		const filesPromises = this.addedConstructionPhotos.map((file) => {
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
				.registerFile(this.constructionGuid, formData, 'foto')
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
			this.addedConstructionPhotos.splice(index, 1);
			return;
		}

		const removedId: number = this.constructionPhotos.splice(index, 1)[0]
			.id as number;
		this.deletedConstructionPhotos.push(removedId);
	}

	deletePhotos() {
		const promises: Promise<{ response?: any; err?: any }>[] = [];

		this.deletedConstructionPhotos.forEach((photoId) => {
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
	/* END PHOTO UPLOAD */

	onSubmit(e: Event) {}

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
}
