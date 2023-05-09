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
	isUploading = false;

	deletedAttachments: Set<number> = new Set();
	isDeleting = false;

	errorMessage: string = '';

	constructor(private anexoService: AnexoService) {}

	ngOnInit() {
		this.listAttachments();
	}

	listAttachments() {
		this.deletedAttachments.clear();
		this.fileInput && (this.fileInput.nativeElement.value = '');

		if (this.guid)
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
		else this.attachments = [];
	}

	addAttachment(event: Event) {
		const fileList = (event?.target as HTMLInputElement)
			?.files as ArrayLike<File>;

		console.log('adding', fileList);

		if (!fileList || fileList.length < 1) return;

		for (let i = 0; i < fileList.length; i++) {
			this.newAttachments.push({
				fileName: fileList[i].name,
				file: fileList[i],
			});
		}
		console.log(this.newAttachments);
	}

	saveAttachments = () => {
		const formData = new FormData();

		this.isUploading = true;

		this.newAttachments.forEach((attach) => {
			formData.append('files', attach.file);
		});

		return new Promise((res, rej) => {
			this.anexoService
				.registerFile(this.guid, formData, 'outrosdocs')
				.pipe(first())
				.subscribe({
					next: (response) => {
						if (response.success) {
							res(response);
							console.log(response);
							this.newAttachments = [];
							this.errorMessage = '';
						} else {
							rej(response);
							this.errorMessage = response.message ?? 'Erro no upload.';
						}
						this.listAttachments();
						this.isUploading = false;
					},
					error: (err) => {
						rej(err);
						console.log('error', err);
						this.isUploading = false;
						this.errorMessage = err.message;
					},
				});
		});
	};

	removeNewAttachment(index: number) {
		this.newAttachments.splice(index, 1);
		this.fileInput.nativeElement.value = '';
		this.clearError();
	}

	removeAttachment(code: number) {
		this.deletedAttachments.add(code);
		this.clearError();
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
								} else {
									rej(response);
									this.errorMessage =
										response.message ?? 'Erro ao deletar anexo.';
								}
							},
							error: (err) => {
								rej(err);
								this.errorMessage = err.message ?? 'Erro ao deletar anexo.';
							},
						});
				})
			);
		});

		Promise.all(promises)
			.then((response) => {
				console.log('resopnse', response);
				this.isDeleting = false;
				this.listAttachments();
			})
			.catch((err) => {
				this.isDeleting = false;
				console.error('Erro na deleção de anexos: ', err);
				this.listAttachments();
			});
	};

	clearError() {
		if (this.newAttachments.length === 0 && this.deletedAttachments.size === 0)
			this.errorMessage = '';
	}

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
