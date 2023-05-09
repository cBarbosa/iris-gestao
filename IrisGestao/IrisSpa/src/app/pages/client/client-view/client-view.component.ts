import { identifierName } from '@angular/compiler';
import {
	Component,
	Input,
	OnInit,
	PipeTransform,
	ViewChild,
} from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Imovel } from 'src/app/shared/models';
import { ClienteService } from '../../../shared/services/cliente.service';
import { Contato } from 'src/app/shared/models/contato.model';
import { ContatoService } from 'src/app/shared/services/contato.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { TelefonePipe } from 'src/app/shared/pipes/telefone.pipe';

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
	isInativar = false;

	displayClientDetails = false;

	isMobile: boolean = false;

	cardPipes: Record<string, PipeTransform>;

	displayModal = false;
	displayConfirmationModal = false;
	displayConfirmationInactiveModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	tableMenu: MenuItem[];
	tableMenuContract: MenuItem[];

	isCnpj: boolean = false;
	contacts: Contato[];
	selectedContact: Contato | null = null;

	contactDetailsVisible = false;
	contactRegisterVisible = false;
	contactEditVisible = false;

	contractidSelected: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private clienteService: ClienteService,
		private contatoService: ContatoService,
		private responsiveService: ResponsiveService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.uid = paramMap.get('uid') ?? '';
		});
	}

	ngOnInit(): void {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			telefone: new TelefonePipe(),
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
		};

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
				icon: 'ph-trash',
				command: () => this.confirmDelete(),
			},
		];

		this.tableMenuContract = [
			{
				label: 'Detalhes',
				icon: 'ph-eye',
				command: () => this.showContract(),
			},
		];
		this.getByIdCliente();
	}

	getByIdCliente() {
		this.isLoadingView = true;
		this.clienteService
			.getClienteById(this.uid)
			.pipe(first())
			.subscribe((event) => {
				this.cliente = event;
				this.isCnpj = event.cpfCnpj.length > 11;
				//console.log('Detalhes Cliente >> ' + JSON.stringify(event));
				this.properties = [...event.imovel];
				console.log(this.properties);
				this.contacts = event.contato.map((contato: Contato) => {
					return {
						guidReferenciaContato: contato.guidReferenciaContato,
						nome: contato.nome,
						cargo: contato.cargo,
						email: contato.email,
						telefone: contato.telefone,
						dataNascimento:
							contato.dataNascimento != null
								? new Date(contato.dataNascimento as string).toLocaleDateString(
										'pt-BR'
								  )
								: null,
						dataNascimentoOriginal: contato.dataNascimento,
					};
				});
				console.log('->>>', this.contacts);

				this.isLoadingView = false;
			});
	}

	toggleClientDetails() {
		this.displayClientDetails = !this.displayClientDetails;
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
							dataNascimento:
								contato.dataNascimento != null
									? new Date(
											contato.dataNascimento as string
									  ).toLocaleDateString('pt-BR')
									: null,
							dataNascimentoOriginal: contato.dataNascimento,
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

	confirmDelete = (): void => {
		this.displayConfirmationModal = true;
	};

	closeConfirmationModal = (): void => {
		this.displayConfirmationModal = false;
	};

	closeModal = (): void => {
		this.displayModal = false;
	};

	confirmInativar = (): void => {
		this.displayConfirmationInactiveModal = true;
	};

	closeConfirmationInativarModal = (): void => {
		this.displayConfirmationInactiveModal = false;
	};

	setCurrentContact = (item: Contato): void => {
		this.selectedContact = { ...item, guidClienteReferencia: this.uid };
	};

	setCurrentContract = (item: any): void => {
		console.log('Contrato Selecionado >> ' + JSON.stringify(item));
		this.contractidSelected = item.guidReferencia;
	};

	showContract = (): void => {
		this.navigateTo('rent-contract/details/' + this.contractidSelected);
	};

	showContactDetails = (): void => {
		this.contactDetailsVisible = true;
		this.contactEditVisible = false;
		this.contactRegisterVisible = false;
	};

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

	deleteContact = (): void => {
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
	};

	inativarCliente = (): void => {
		this.closeConfirmationModal();
		this.clienteService.inativarCliente(this.uid, false).subscribe({
			next: (response) => {
				console.log('InativarCliente >> retorno ' + JSON.stringify(response));
				if (response.success) {
					this.closeConfirmationInativarModal();
					this.isInativar = true;
					this.onUpdateContactList({
						header: 'Cliente Inativado',
						message: response.message ?? 'Cliente inativado com sucesso',
					});
				} else {
					this.onUpdateContactList({
						header: 'Cliente não inativado',
						message: response.message ?? 'Erro na inativação de contato',
						isError: true,
					});
				}
			},
			error: (err) => {
				console.error(err);
				this.onUpdateContactList({
					header: 'Contato não inativado',
					message: 'Erro no envio de dados',
					isError: true,
				});
			},
		});
	};

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
	};
}
