import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { first } from 'rxjs';
import { Contato } from 'src/app/shared/models';
import { TelefonePipe } from 'src/app/shared/pipes/telefone.pipe';
import { ContatoService, FornecedorService, LoginService } from 'src/app/shared/services';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';

@Component({
	selector: 'app-supplier-view',
	templateUrl: './supplier-view.component.html',
	styleUrls: ['./supplier-view.component.scss'],
})
export class SupplierViewComponent implements OnInit {
	uid: string;
	isLoadingView: boolean = false;
	supplier: any;
	tableMenu: MenuItem[];
	isCnpj: boolean = false;
	contacts: Contato[];
	selectedContact: Contato | null = null;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	isMobile: boolean = false;
	displaySupplierDetails = false;
	cardPipes: Record<string, PipeTransform>;

	displayModal: boolean = false;
	isInativar: boolean = false;
	contactDetailsVisible: boolean = false;
	contactRegisterVisible: boolean = false;
	contactEditVisible: boolean = false;
	displayConfirmationModal: boolean = false;

	properties = [];

	isFormEditable:boolean = this.loginService.checkAllowedRoleItem(['administrativo', 'coordenação', 'diretoria']);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private supplierService: FornecedorService,
		private contatoService: ContatoService,
		private responsiveService: ResponsiveService,
		private loginService: LoginService
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

		this.getByUuid();
	}

	getByUuid = (): void => {
		this.isLoadingView = true;
		this.supplierService.getSupplierById(this.uid).subscribe((event) => {
			this.supplier = event;
			this.isCnpj = event.cpfCnpj.length > 11;
			// this.properties = [...event.imovel];

			this.contacts = event.contato.map((contato: Contato) => {
				return {
					guidReferenciaContato: contato.guidReferenciaContato,
					nome: contato.nome,
					cargo: contato.cargo,
					email: contato.email,
					telefone: contato.telefone,
					dataNascimento:
						contato.dataNascimento != null
							? new Date(contato.dataNascimento as string).toLocaleDateString()
							: null,
				};
			});

			this.properties = event.contratos?.map((contrato: any) => {
				return contrato.imovel;
			});

			this.isLoadingView = false;
		});
	};

	toggleSupplierDetails() {
		this.displaySupplierDetails = !this.displaySupplierDetails;
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}

	showContactRegister = (): void => {
		this.contactDetailsVisible = false;
		this.contactEditVisible = false;
		this.contactRegisterVisible = true;
	};

	setCurrentContact = (item: Contato): void => {
		this.selectedContact = { ...item, guidClienteReferencia: this.uid };
	};

	hideContactRegister = (): void => {
		this.contactRegisterVisible = false;
	};

	hideContactDetails = (): void => {
		this.contactDetailsVisible = false;
	};

	hideContactEdit = () => {
		this.contactEditVisible = false;
	};

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

	onUpdateContactList = (modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	}): void => {
		this.hideContactDetails();
		this.hideContactEdit();
		this.hideContactRegister();
		this.getContactList();

		this.modalContent = modalContent;
		this.displayModal = true;
	};

	getContactList = (): void => {
		this.contacts = [];
		this.contatoService
			.getContactsBySuppleirId(this.uid)
			.pipe(first())
			.subscribe({
				next: (response) => {
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
									  ).toLocaleDateString()
									: null,
						};
					});
				},
				error: (err) => {
					console.error(err);
				},
			});
	};

	closeConfirmationModal = (): void => {
		this.displayConfirmationModal = false;
	};

	confirmDelete = (): void => {
		this.displayConfirmationModal = true;
	};

	closeModal = (): void => {
		this.displayModal = false;
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
}
