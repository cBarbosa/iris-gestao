import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { Contato } from '../models/contato.model';

export type ContatoUpdate = {
	guidClienteReferencia: string | null;
	guidFornecedorReferencia: string | null;
	nome: string;
	email: string;
	telefone: string;
	cargo: string;
	dataNascimento: string | null;
};

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ContatoService {
	constructor(private http: HttpClient) {}

	getContact(guid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Contato/${guid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContact: ${response.message}`);
					return response;
				})
			);
	}

	getContactsByClientId(clientGuid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Contato/${clientGuid}/cliente`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContactsByClientId: ${response.message}`);
					return response;
				})
			);
	}

	registerContact(contact: ContatoUpdate) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Contato/Criar`,
			JSON.stringify(contact, null, 2),
			httpOptions
		);
	}

	updateContact(guid: string, contact: ContatoUpdate) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Contato/${guid}/atualizar`,
			JSON.stringify(contact, null, 2),
			httpOptions
		);
	}

	deleteContact(guid: string) {
		return this.http.delete<ApiResponse>(
			`${env.config.apiUrl}Contato/${guid}/deletar`
		);
	}

	getContactsBySuppleirId(supplierGuid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Contato/${supplierGuid}/fornecedor`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContactsByClientId: ${response.message}`);
					return response;
				})
			);
	}
}
