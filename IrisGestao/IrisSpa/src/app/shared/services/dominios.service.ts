import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class DominiosService {
	constructor(private http: HttpClient) {}

	getTipoCliente() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/tipo-cliente`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getTipoCliente: ${response.message}`);
				})
			);
	}

	getTipoUnidade() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/tipo-unidade`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getTipoUnidade: ${response.message}`);
				})
			);
	}

	getCategoriaImovel() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/categoria-imovel`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getCategoriaImovel: ${response.message}`);
				})
			);
	}
}
