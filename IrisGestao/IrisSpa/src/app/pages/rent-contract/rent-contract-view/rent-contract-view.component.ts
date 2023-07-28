import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models';
import { ContratoAluguel } from 'src/app/shared/models/contrato-aluguel.model';
import {
	Attachment,
	AnexoService,
} from 'src/app/shared/services/anexo.service';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-rent-contract-view',
	templateUrl: './rent-contract-view.component.html',
	styleUrls: ['./rent-contract-view.component.scss'],
})
export class RentContractViewComponent {
	contract: any;
	isLoadingView = false;
	guid: string;

	taxRetention: string;

	displayModal: boolean = false;
	isMobile = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	isAdjusting: boolean = false;

	contactList:
		| {
				nome: string;
				cargo: string;
				email: string;
				telefone: string;
				nascimento: string;
		  }[]
		| null = null;
	contactsVisible = false;
	adjustVisible = false;

	attachmentDocs: {
		projeto?: Attachment;
		matricula?: Attachment;
		habitese?: Attachment;
		outros?: Attachment;
	} = {};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private rentContractService: RentContractService,
		private anexoService: AnexoService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.guid = paramMap.get('guid') ?? '';
		});
	}

	ngOnInit() {
		this.getData();
		this.getAtachs();
	}

	getData(): void {
		this.isLoadingView = true;

		const view = this.rentContractService
			.getContractByGuid(this.guid)
			?.pipe(first())
			.subscribe((response: ApiResponse) => {
				this.contract = response.data;

				this.taxRetention = this.contract.percentualRetencaoImpostos;

				this.contactList = this.contract.cliente?.contato?.map(
					(contato: any) => {
						return {
							nome: contato.nome,
							cargo: contato.cargo,
							email: contato.email,
							telefone: contato.telefone,
							nascimento: contato.dataNascimento,
						};
					}
				);

				console.log(this.contract);
				// this.property = imovel;
				// this.units = imovel.unidade!;
				// this.imageList = imovel.imagens!;
				this.isLoadingView = false;
				// this.isCorporativeBuilding =
				// 	this.units[0].idTipoUnidadeNavigation?.id == 1;
			});
	}

	unitReduce(units: any) {
		const formatted = units.reduce((acc: string, u: any) => {
			return acc + u.idUnidae + ', ';
		}, '');
		return formatted.slice(0, -2);
	}

	adjustContract() {
		if (this.taxRetention.length === 0) return;

		this.isAdjusting = true;

		this.rentContractService
			.adjustContract(this.guid, +this.taxRetention)
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.isAdjusting = false;
					console.log('event:', event);
					if (event.success) {
						this.modalContent = {
							isError: false,
							header: 'Cadastro ajustado',
							message: event.message ?? 'Ajuste realizado com sucesso.',
						};

						this.contract.percentualRetencaoImpostos = +this.taxRetention;
					} else {
						this.modalContent = {
							isError: true,
							header: 'Cadastro não ajustado',
							message: event.message ?? 'Ajuste não realizado.',
						};
					}

					this.openModal();
				},
				error: (err) => {
					this.modalContent = {
						isError: true,
						header: 'Cadastro não ajustado',
						message: 'Erro no envio de dados.',
					};

					this.openModal();
				},
			});
	}

	showContacts() {
		this.contactsVisible = true;
	}

	hideContacts() {
		this.contactsVisible = false;
	}

	showAdjustment() {
		this.adjustVisible = true;
	}

	hideAdjustment = () => {
		this.adjustVisible = false;
	};

	openModal() {
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	toggleModal() {
		this.displayModal = !this.displayModal;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	getAtachs(): void {
		this.anexoService
			.getFiles(this.guid)
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.forEach((file) => {
						const classificacao = file.classificacao;

						if (classificacao === 'projeto') this.attachmentDocs.projeto = file;
						else if (classificacao === 'matricula')
							this.attachmentDocs.matricula = file;
						else if (classificacao === 'habitese')
							this.attachmentDocs.habitese = file;
						else if (classificacao === 'outrosdocs')
							this.attachmentDocs.outros = file;
					});
				},
				error: (err) => {
					console.error(err);
				},
			});
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
