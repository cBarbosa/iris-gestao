import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Contato } from 'src/app/shared/models/contato.model';
import { TelefonePipeModule } from 'src/app/shared/pipes/telefone.module';
import { ContatoService } from 'src/app/shared/services/contato.service';
import { ContactEditSidebarComponent } from '../contact-edit-sidebar/contact-edit-sidebar.component';

@Component({
	standalone: true,
	imports: [
		CommonModule,
		TelefonePipeModule,
		ButtonModule,
		ContactEditSidebarComponent,
		DialogModule,
	],
	selector: 'app-contact-detail-sidebar',
	templateUrl: './contact-detail-sidebar.component.html',
	styleUrls: ['./contact-detail-sidebar.component.scss'],
})
export class ContactDetailSidebarComponent {
	@Input()
	data: Contato;

	@Input()
	openEditForm: Function;

	@Input()
	onDelete: Function;

	@Input()
	isFormEditable?: boolean;

	displayConfirmationModal = false;

	displayModal: false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	constructor(private contatoService: ContatoService) {}

	confirmDelete() {
		this.displayConfirmationModal = true;
	}

	closeConfirmationModal() {
		this.displayConfirmationModal = false;
	}

	deleteContact() {
		console.log(this.data);
		this.closeConfirmationModal();
		if (this.data.guidReferenciaContato) {
			this.contatoService
				.deleteContact(this.data.guidReferenciaContato)
				.subscribe({
					next: (response) => {
						if (response.success) {
							this.onDelete({
								header: 'Contato excluído',
								message: response.message,
							});
						} else {
							this.onDelete({
								header: 'Contato não excluído',
								message: response.message,
								isError: true,
							});
						}
					},
					error: (err) => {
						console.error(err);
						this.onDelete({
							header: 'Contato não excluído',
							message: 'Erro no envio de dados',
							isError: true,
						});
					},
				});
		}
	}

	editContact() {
		this.openEditForm();
	}
}
