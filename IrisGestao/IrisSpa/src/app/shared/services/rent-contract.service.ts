import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class RentContractService {
	constructor(private http: HttpClient) {}

	getContracts(
		limit: number = 50,
		page: number = 1,
		idTipo: number = 1,
		filter?: string,
		typeId?: number
	) {
		return this.http
			.get<ApiResponse>(
				`${
					env.config.apiUrl
				}ContratoAluguel?limit=${limit}&page=${page}&idTipo=${idTipo}${
					filter ? `&nome=${filter}` : ''
				}${typeId ? `&idTipo=${typeId}` : ''}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContracts: ${response.message}`);
					return response;
				})
			);
	}

	getContractByGuid(guid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}ContratoAluguel/${guid}/guid`)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getContractByGuid: ${response.message}`);
				})
			);
	}
}
