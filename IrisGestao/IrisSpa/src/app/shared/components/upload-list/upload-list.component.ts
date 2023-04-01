import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils } from '../../utils';
import { AnexoService } from '../../services/anexo.service';
import { first } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
	selector: 'app-upload-list',
	standalone: true,
	imports: [CommonModule, FileUploadModule],
	templateUrl: './upload-list.component.html',
	styleUrls: ['./upload-list.component.scss'],
})
export class UploadListComponent {
	@Input()
	editable = true;

	@Input()
	guid: string;

	@ViewChild('fileInput') fileInput: ElementRef;

	attachments: Array<{
		fileName: string;
		fileLocation: string;
		code: number;
	}> = [];

	newAttachments: Array<{
		fileName: string;
		file: File;
	}> = [];

	deletedAttachments: Set<number> = new Set();
	isDeleting = false;

	constructor(private anexoService: AnexoService) {}

	ngOnInit() {
		this.anexoService
			.getFiles(this.guid)
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.attachments =
						event
							?.filter(
								({ classificacao }) =>
									classificacao !== 'capa' && classificacao !== 'foto'
							)
							.map(({ nome, local, id }) => {
								return {
									fileName: nome,
									fileLocation: local,
									code: id,
								};
							}) ?? [];

					console.debug('attachmentList', this.attachments);
				},
				error: (error) => {
					console.error('Erro: ', error);
				},
			});
	}

	addAttachment(event: Event) {
		const fileList = (event?.target as HTMLInputElement)
			?.files as ArrayLike<File>;

		if (!fileList || fileList.length < 1) return;

		const fileArray = Array.from(fileList);

		this.newAttachments.concat(
			fileArray.map((file: File) => ({
				fileName: file.name,
				file: file,
			}))
		);
	}

	saveAttachment = () => {
		const formData = new FormData();

		this.newAttachments.forEach((attach) => {
			formData.append('files', attach.file);
		});

		return new Promise((res, rej) => {
			this.anexoService
				.registerFile(this.guid, formData, 'outrosdocs')
				.pipe(first())
				.subscribe({
					next(response) {
						if (response.success) res(response);
						else rej(response);
					},
					error(err) {
						rej(err);
					},
				});
		});
	};

	removeAttachment(code: number) {
		this.deletedAttachments.add(code);
	}

	deleteAttachments = () => {
		const promises: Promise<{
			message?: string;
			success: boolean;
		}>[] = [];

		this.isDeleting = true;

		this.deletedAttachments.forEach((deletedCode) => {
			promises.push(
				new Promise((res, rej) => {
					this.anexoService
						.deleteFile(deletedCode)
						.pipe(first())
						.subscribe({
							next: (response) => {
								if (response.success) {
									res(response);

									this.deletedAttachments.delete(deletedCode);
								} else rej(response);
							},
							error(err) {
								rej(err);
							},
						});
				})
			);
		});

		Promise.all(promises)
			.then((response) => {
				console.log('resopnse', response);
				this.isDeleting = false;
			})
			.catch((err) => {
				this.isDeleting = false;
				console.error('Erro na deleção de anexos: ', err);
			});
	};

	openFileSelect() {
		this.fileInput.nativeElement.click();
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
