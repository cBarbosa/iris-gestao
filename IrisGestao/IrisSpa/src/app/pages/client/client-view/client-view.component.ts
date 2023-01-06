import { identifierName } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Imovel } from 'src/app/shared/models';
import { ClienteService } from '../../../shared/services/cliente.service';
import { Contato } from 'src/app/shared/models/contato.model';
import { ContatoService } from 'src/app/shared/services/contato.service';

@Component({
	selector: 'app-client-view',
	templateUrl: './client-view.component.html',
	styleUrls: ['./client-view.component.scss'],
	providers: [ClienteService, DatePipe],
})
export class ClientViewComponent implements OnInit {
	properties: Imovel[] = [];
	uid: string;
	cliente: any;
	totalClientCount: number;
	isLoadingView = false;

	displayModal = false;
	displayConfirmationModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	tableMenu: MenuItem[];

	isCnpj: boolean = false;
	contacts: Contato[];
	selectedContact: Contato | null = null;

	contactDetailsVisible = false;
	contactRegisterVisible = false;
	contactEditVisible = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private clienteService: ClienteService,
		private contatoService: ContatoService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';
		});
	}

	ngOnInit(): void {
		this.tableMenu = [
			{
				label: 'Detalhes',
				icon: 'ph-eye',
				command: () => this.showContactDetails(),
			},
			{
				label: 'Editar',
				icon: 'ph-note-pencil',
				command: () => this.showContactEdit(),
			},
			{
				label: 'Excluir',
				icon: 'ph-copy-simple',
				command: () => this.confirmDelete(),
			},
		];

		this.getByIdCliente();
	}

	getByIdCliente() {
		this.isLoadingView = true;
		this.clienteService.getClienteById(this.uid).subscribe((event) => {
			this.cliente = event;
			this.isCnpj = event.cpfCnpj.length > 11;
			console.log('>>>>>>>>>', this.isCnpj);

			this.properties = [...event.imovel];
			this.contacts = event.contato.map((contato: Contato) => {
				return {
					guidReferenciaContato: contato.guidReferenciaContato,
					nome: contato.nome,
					cargo: contato.cargo,
					email: contato.email,
					telefone: contato.telefone,
					dataNascimento: new Date(
						contato.dataNascimento as string
					).toLocaleDateString(),
				};
			});
			this.isLoadingView = false;
		});
	}

	getContactList() {
		this.contacts = [];
		this.contatoService
			.getContactsByClientId(this.uid)
			.pipe(first())
			.subscribe({
				next: (response) => {
					console.log('response', response);
					this.contacts = response.data.map((contato: Contato) => {
						return {
							guidReferenciaContato: contato.guidReferencia,
							nome: contato.nome,
							cargo: contato.cargo,
							email: contato.email,
							telefone: contato.telefone,
							dataNascimento: new Date(
								contato.dataNascimento as string
							).toLocaleDateString(),
						};
					});
				},
				error: (err) => {
					console.error(err);
				},
			});
	}

	onUpdateContactList = (modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	}) => {
		this.hideContactDetails();
		this.hideContactEdit();
		this.hideContactRegister();
		this.getContactList();

		this.modalContent = modalContent;
		this.displayModal = true;
	};

	confirmDelete() {
		this.displayConfirmationModal = true;
	}

	closeConfirmationModal() {
		this.displayConfirmationModal = false;
	}

	closeModal() {
		this.displayModal = false;
	}

	setCurrentContact(item: Contato): void {
		this.selectedContact = { ...item, guidClienteReferencia: this.uid };
	}

	showContactDetails() {
		this.contactDetailsVisible = true;
		this.contactEditVisible = false;
		this.contactRegisterVisible = false;
	}

	showContactEdit = () => {
		this.contactDetailsVisible = false;
		this.contactEditVisible = true;
		this.contactRegisterVisible = false;
	};

	showContactRegister = () => {
		this.contactDetailsVisible = false;
		this.contactEditVisible = false;
		this.contactRegisterVisible = true;
	};

	hideContactDetails = () => {
		this.contactDetailsVisible = false;
	};

	hideContactEdit = () => {
		this.contactEditVisible = false;
	};

	hideContactRegister = () => {
		this.contactRegisterVisible = false;
	};

	deleteContact() {
		this.closeConfirmationModal();
		if (this.selectedContact?.guidReferenciaContato) {
			this.contatoService
				.deleteContact(this.selectedContact.guidReferenciaContato)
				.subscribe({
					next: (response) => {
						if (response.success) {
							this.onUpdateContactList({
								header: 'Contato excluído',
								message: response.message ?? 'Contato excluído com sucesso',
							});
						} else {
							this.onUpdateContactList({
								header: 'Contato não excluído',
								message: response.message ?? 'Erro na exclusão de contato',
								isError: true,
							});
						}
					},
					error: (err) => {
						console.error(err);
						this.onUpdateContactList({
							header: 'Contato não excluído',
							message: 'Erro no envio de dados',
							isError: true,
						});
					},
				});
		}
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
