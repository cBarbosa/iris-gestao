import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class DashboardService {
	constructor(private http: HttpClient) {}

	getFinancialVacancy(
		DateRefInit: string,
		DateRefEnd: string,
		IdLocador?: number,
		IdTipoImovel?: number
	) {
		const obj:any = {};

		if(IdLocador) {
			obj.IdLocador=IdLocador;
		}

		if(IdTipoImovel) {
			obj.IdTipoImovel = IdTipoImovel;
		}



		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/financial-vacancy`, {
				params: {
					DateRefInit,
					DateRefEnd,
					...obj
				},
			})
			.pipe(
				map((response) => {
					console.log('suppliers response', response);
					if (!response.success)
						console.error(`suppliers: ${response.message}`);
					return response;
				})
			);
	}

	getSupplierById(uid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/${uid}/guid`)
			.pipe(
				map((response) => {
					console.log('supplier response', response);
					if (response.success) return response.data;
					else return console.error(`getSupplier: ${response.message}`);
				})
			);
	}

	createSupplier(form: any) {
		return this.http
			.post<ApiResponse>(
				`${env.config.apiUrl}Dashboard/Criar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('supplier response', response);
					if (response) return response;
					else return console.error(`createSupplier: ${response}`);
				})
			);
	}

	updateSupplier(uid: string, form: any) {
		return this.http
			.put<ApiResponse>(
				`${env.config.apiUrl}Dashboard/${uid}/atualizar`,
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
}
