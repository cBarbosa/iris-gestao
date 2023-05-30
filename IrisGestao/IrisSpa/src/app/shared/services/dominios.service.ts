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

	getTiposContrato() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/tipo-contrato`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getTiposContrato: ${response.message}`);
				})
			);
	}

	getTiposCreditoAluguel() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/tipo-credito-aluguel`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getTiposCreditoAluguel: ${response.message}`);
					return response;
				})
			);
	}

	getBanks() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/bancos`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getBanks: ${response.message}`);
				})
			);
	}

	getFormasPagamento() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/forma-pagamento`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getFormasPagamento: ${response.message}`);
					return response;
				})
			);
	}

	getTiposServico() {
		return new Observable<ApiResponse>((subscriber) => {
			subscriber.next({
				success: true,
				message: 'Dados carregados com sucesso',
				data: [
					{
						id: 1,
						nome: 'Segurança',
					},
					{
						id: 2,
						nome: 'Limpeza',
					},
					{
						id: 3,
						nome: 'Recepção',
					},
					{
						id: 4,
						nome: 'Copa',
					},
				],
			});
		});
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/tipo-cliente`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getTiposServico: ${response.message}`);
				})
			);
	}

	getTiposTitulo() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/tipo-titulo`)
			.pipe(
				map((response) => {
					if (response.success) return response;
					else return console.error(`getTiposTitulo: ${response.message}`);
				})
			);
	}
}
