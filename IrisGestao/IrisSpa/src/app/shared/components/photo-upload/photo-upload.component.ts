import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils } from '../../utils';
import {
	AnexoService,
	ArquivoClassificacoes,
} from '../../services/anexo.service';
import { first } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';

type Base64Metadata = {
	name: string;
	data: File | string | ArrayBuffer | null;
	mimetype: string;
	isNew?: boolean;
	id?: number | string;
};

@Component({
	selector: 'app-photo-upload',
	standalone: true,
	imports: [CommonModule, FileUploadModule],
	templateUrl: './photo-upload.component.html',
	styleUrls: ['./photo-upload.component.scss'],
})
export class PhotoUploadComponent {
	@Input()
	guid: string | undefined;

	// @Input()
	// limit: number = 10;

	@Input()
	maxFileSize: number = 1000000;

	@Output() selectEvent = new EventEmitter<File[]>();

	// limitReached: boolean = false;

	photos: Base64Metadata[] = [];

	addedBase64Photos: Base64Metadata[] = [];

	deletedPhotos: number[] = [];

	errorMessage: string = '';

	constructor(private anexoService: AnexoService) {}

	onInit() {
		this.photos;

		if (this.guid)
			this.anexoService
				.getFiles(this.guid)
				.pipe(first())
				.subscribe({
					next: (event) => {
						const photoAttachments = event?.filter(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'foto'
						);

						console.debug('attachmentsObj', photoAttachments);

						if (photoAttachments?.length)
							this.photos = photoAttachments.map((foto) => {
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

	addPhoto(event: any) {
		this.errorMessage = '';
		const files = event.target.files;

		const base64promises = [...files]
			.filter((file: File) => {
				if (file.size < this.maxFileSize) {
					return true;
				}
				const formatter = Intl.NumberFormat('en', {
					notation: 'compact',
					style: 'unit',
					unit: 'byte',
					unitDisplay: 'narrow',
				});

				this.errorMessage = `Os arquivos devem ser menores que ${formatter.format(
					this.maxFileSize
				)}.`;
				return false;
			})
			.map((file: File) => {
				return Utils.fileToDataUrl(file);
			});

		Promise.all(base64promises).then((base64files) => {
			base64files.forEach((base64file) => {
				this.addedBase64Photos.push(base64file);
			});

			this.emitFiles();
		});
	}

	removePhoto(index: number, newPhoto = false) {
		this.errorMessage = '';
		if (newPhoto) {
			this.addedBase64Photos.splice(index, 1);
			this.emitFiles();
			return;
		}

		if (!this.guid) return;

		const removedId: number = this.photos.splice(index, 1)[0].id as number;

		this.deletedPhotos.push(removedId);
	}

	deletePhotos() {
		if (!this.guid) return;

		const promises: Promise<{ response?: any; err?: any }>[] = [];

		this.deletedPhotos.forEach((photoId) => {
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

	async savePhotos() {
		if (!this.guid) return;

		if (this.addedBase64Photos.length === 0) return;

		const filesPromises = this.addedBase64Photos.map((file) => {
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
				.registerFile(this.guid!, formData, 'foto')
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

	emitFiles() {
		if (this.selectEvent === undefined) return;

		const filesPromises = this.addedBase64Photos.map((file) => {
			return Utils.dataUrlToFile(file.data as string, file.name, file.mimetype);
		});

		Promise.all(filesPromises).then((files) => {
			this.selectEvent.emit(files);
		});
	}

	// onSelect(e: { originalEvent: Event; files: File[]; currentFiles: File[] }) {
	// 	console.log('select event', e);

	// 	for (let i = 0; i < e.files.length; i++) {
	// 		if (this.photos.length < this.limit)
	// 			this.addedFilePhotos.push(e.files[i]);
	// 		if (this.photos.length >= this.limit) {
	// 			this.limitReached = true;
	// 			break;
	// 		}
	// 	}

	// 	if (this.selectEvent) this.selectEvent.emit(this.addedFilePhotos);
	// }
}
