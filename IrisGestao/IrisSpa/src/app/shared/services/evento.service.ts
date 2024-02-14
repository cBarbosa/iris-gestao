import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

export type CreateEventObj = {
	guidImovel: string;
	guidCliente: string;
	guidReferencia: string | null;
	nome: string;
	descricao: string;
	dthRealizacao: Date;
	lstUnidades: string[];
};

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class EventoService {

	constructor(private http: HttpClient) {}

	getEvents(limit: number = 50, page: number = 1) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Evento?limit=${limit}&page=${page}`
			)
			.pipe(
				map((response) => {
					console.log('getEvents response', response);
					if (!response.success)
						console.error(`getEvents: ${response.message}`);
					return response;
				})
			);
	}

	getEventById(id: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Evento/${id}/id`)
			.pipe(
				map((response) => {
					console.log('getEventById response', response);
					if (!response.success)
						console.error(`getEventById: ${response.message}`);
					return response.data;
				})
			);
	}

	createEvent(form: CreateEventObj) {
		return this.http
			.post<ApiResponse>(
				`${env.config.apiUrl}Evento/Criar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('createEvent response', response);
					if (!response.success) console.error(`createEvent: ${response}`);
					return response;
				})
			);
	}

	updateEvent(
		id: string,
		form: CreateEventObj
	) {
		return this.http
			.put<ApiResponse>(
				`${env.config.apiUrl}Evento/${id}/atualizar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('updateEvent response', response);
					if (!response.success)
						console.error(`updateEvent: ${response.message}`);
					return response;
				})
			);
	};

	getActiveRenters() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Evento/lista-locadores`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getActiveRenters: ${response.message}`);
					return response;
				})
			);
	};

	getActiveProperties() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Evento/lista-imoveis`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getActiveProperties: ${response.message}`);
					return response;
				})
			);
	};

}
