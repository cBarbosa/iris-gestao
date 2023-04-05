import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { IReceita } from '../models/receita.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class RevenueService {
	constructor(private http: HttpClient) {}

	getRevenues(
		limit: number = 50,
		page: number = 1,
		numeroTitulo?: string,
		idTipoTitulo?: number
	) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}TituloReceber?limit=${limit}&page=${page}${
					numeroTitulo ? `&numeroTitulo=${numeroTitulo}` : ''
				}${idTipoTitulo ? `&idTipoTitulo=${idTipoTitulo}` : ''}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getRevenues: ${response.message}`);
					return response;
				})
			);
	}

	getRevenueByGuid(revenueGuid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}TituloReceber/${revenueGuid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getRevenueByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerRevenue(revenueObj: IReceita) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}TituloReceber/Criar`,
			JSON.stringify(revenueObj, null, 2),
			httpOptions
		);
	}

	updateRevenue(guid: string, receita: IReceita) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}TituloReceber/${guid}/atualizar`,
			JSON.stringify(receita, null, 2),
			httpOptions
		);
	}
}
