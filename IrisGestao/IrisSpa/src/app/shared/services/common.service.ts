import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CommonService {
	constructor(private http: HttpClient) {}

	getAddressByCEP(cep: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}ImovelEndereco/${cep}/cep`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getAddressByCEP: ${response.message}`);
					return response;
				})
			);
	}

	getPropertyCategories() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dominios/categoria-imovel`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getPropertyCategories: ${response.message}`);
					return response;
				})
			);
	}
}
