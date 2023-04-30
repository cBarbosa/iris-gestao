import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	HostListener,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { Utils } from '../../utils';
import { TooltipModule } from 'primeng/tooltip';
import { AnexoService } from '../../services/anexo.service';
import { first } from 'rxjs';

@Component({
	selector: 'app-attachment-list',
	standalone: true,
	imports: [CommonModule, TooltipModule],
	templateUrl: './attachment-list.component.html',
	styleUrls: ['./attachment-list.component.scss'],
})
export class AttachmentListComponent {
	@Input()
	guid: string;

	@ViewChild('attachmentCard') attachmentCard: ElementRef<HTMLDivElement>;

	attachments: Array<{
		fileName: string;
		fileLocation: string;
		code: number;
	}> = [];

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

	ngAfterViewInit() {
		this.onResize();
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

	onResize = () => {
		const rem = 16;

		// const currColAMount =
		// this.attachmentCard.nativeElement.style.getPropertyValue('--col-amount');

		// console.log('currColAMount', currColAMount);
		const cardWidth =
			this.attachmentCard.nativeElement.getBoundingClientRect().width;

		const contentSize = cardWidth - 5 * rem;

		const colAmount = Math.floor(contentSize / (13.5 * rem));
		console.log('colAmount', colAmount);
		this.attachmentCard.nativeElement.style.setProperty(
			'--col-amount',
			colAmount.toString()
		);
	};

	@HostListener('window:resize', ['$event'])
	onResizeDebounce = Utils.debounce(this.onResize, 300);
}
