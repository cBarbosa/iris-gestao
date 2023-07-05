import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { Cliente, ClienteType } from '../models';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ClienteService {
	constructor(private http: HttpClient) {}

	getClients(
		limit: number = 50,
		page: number = 1,
		filter?: string,
		typeId?: number
	) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Cliente?limit=${limit}&page=${page}${
					filter ? `&nome=${filter}` : ''
				}${typeId ? `&idTipo=${typeId}` : ''}`
			)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (!response.success)
						console.error(`getClients: ${response.message}`);
					return response;
				})
			);
	}

	getClienteById(uid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Cliente/${uid}/guid`)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (response.success) return response.data;
					else return console.error(`getClients: ${response.message}`);
				})
			);
	}

	updateUnit(uid: string, unit: ClienteType) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Cliente/${uid}/atualizar`,
			JSON.stringify(unit, null, 2),
			httpOptions
		);
	}

	saveUnit(unit: ClienteType) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Cliente/Criar`,
			JSON.stringify(unit, null, 2),
			httpOptions
		);
	}

	criarCliente(form: any) {
		return this.http
			.post<ApiResponse>(
				`${env.config.apiUrl}Cliente/Criar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (response) return response;
					else return console.error(`getClients: ${response}`);
				})
			);
	}

	atualizarCliente(uid: string, form: any) {
		return this.http
			.put<ApiResponse>(
				`${env.config.apiUrl}Cliente/${uid}/atualizar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (response.success) return response;
					else return console.error(`getClients: ${response.message}`);
				})
			);
	}

	inativarCliente(uid: string, status: boolean) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Cliente/${uid}/${status}/alterar-status`,
			httpOptions
		);
	}

	getListaProprietarios() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Cliente/lista-proprietarios`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getListaProprietarios: ${response.message}`);
					return response;
				})
			);
	}

	getListaProprietariosNew() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}ContratoAluguel/lista-proprietarios`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getListaProprietariosNew: ${response.message}`);
					return response;
				})
			);
	}
}
