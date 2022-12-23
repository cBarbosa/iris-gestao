import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ImovelService {
	constructor(private http: HttpClient) {}

	getPerperties(limit: number = 50, page: number = 1) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Imovel?limit=${limit}&page=${page}`
			)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getPerperties: ${response.message}`);
				})
			);
	};

	getProperty(uid: string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Imovel/${uid}/guid`
			)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getPerperties: ${response.message}`);
				})
			);
	};

	getUnit(uid: string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Unidade/${uid}/guid`
			)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getUnit: ${response.message}`);
				})
			);
	};
}
