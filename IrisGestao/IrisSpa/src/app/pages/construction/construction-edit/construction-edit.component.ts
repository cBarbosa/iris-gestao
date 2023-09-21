import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstructionService } from 'src/app/shared/services/obra.service';
import {
	AnexoService,
	ArquivoClassificacoes,
	Attachment,
} from 'src/app/shared/services/anexo.service';
import { Utils } from 'src/app/shared/utils';
import { first } from 'rxjs';
import { IImovel } from 'src/app/shared/models';
import { ImovelService } from 'src/app/shared/services';

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

	constructionProperty: IImovel;

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

	units = [];
	selectedUnits:Array<string> = [];
	enderedoImovel:string | null = null;

	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private imovelService: ImovelService,
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
				porcentagemConclusao: [null, Validators.required]
			}),
			// attachments: this.fb.group({
			// 	projeto: [null, [Validators.required]],
			// 	matricula: [null, [Validators.required]],
			// 	habitese: [null, [Validators.required]],
			// }),
			photos: this.fb.group({}),
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.getData();

		this.anexoService
			.getFiles(this.constructionGuid)
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.attachmentsObj = {
						foto: event?.filter(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'foto'
						)
					};

					if (this.attachmentsObj?.foto?.length)
						this.constructionPhotos = this.attachmentsObj.foto.map((foto) => {
							return {
								name: foto.nome,
								mimetype: foto.mimeType,
								data: foto.local,
								id: foto.id,
							};
						});
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

	onSubmit(e: Event) {

		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		const editFormData =
			this.editForm.controls['constructionInfo'].getRawValue();

		const constructionObj: {
			Nome: string;
			DataInicio: string;
			DataPrevistaTermino: string;
			Percentual: number;
			ValorOrcamento: number;
			UnidadeGuidReferences: Array<string>;
		} = {
			Nome: editFormData.nome,
			DataInicio: editFormData.dataInicio
				? editFormData.dataInicio.toISOString()
				: '',
			DataPrevistaTermino: editFormData.dataFim
				? editFormData.dataFim.toISOString()
				: '',
			Percentual: +editFormData.porcentagemConclusao,
			ValorOrcamento: editFormData.valorOrcamento,
			UnidadeGuidReferences: this.selectedUnits
		};

		Promise.all([this.deletePhotos(), this.savePhotos()])
			.then((result) => {
				this.constructionService
					.updateConstruction(this.constructionGuid, constructionObj)
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
						'Os arquivos podem estar com o mesmo nome. Para corrigir verifique os arquivos e teste novamente.',
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

	setSelectedUnits(units: string[]) {
		this.selectedUnits = units;
	}

	getData():void {

		this.isLoading = true;

		this.constructionService
			.getConstructionByGuid(this.constructionGuid)
			.subscribe((event: any) => {
				if (event) {
					const data = event.data;

					this.editForm.controls['constructionInfo'].patchValue({
						nome: data.nome ?? '',
						dataInicio: new Date(data.dataInicio),
						dataFim: new Date(data.dataPrevistaTermino),
						valorOrcamento: data.valorOrcamento,
						porcentagemConclusao: data.percentual
					});

					this.constructionProperty = data.imovel;
					
					this.enderedoImovel = `${data.imovel.imovelEndereco[0].rua},
						${data.imovel.imovelEndereco[0].cidade} -
						${data.imovel.imovelEndereco[0].uf}`;

					this.units = data.unidades.map(
						(p: any) => p.guidReferencia
					);

				} else {
					this.invalidGuid = true;
				}

				this.isLoading = false;
			});
	};
}
