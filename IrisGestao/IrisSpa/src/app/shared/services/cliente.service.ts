import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ClienteService {
	constructor(private http: HttpClient) {}

	getClients(limit: number = 50, page: number = 1) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Cliente?limit=${limit}&page=${page}`
			)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (response.success) return response.data;
					else return console.error(`getClients: ${response.message}`);
				})
			);
	}

	getClienteById(uid:string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Cliente/${uid}/guid`
			)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (response.success) return response.data;
					else return console.error(`getClients: ${response.message}`);
				})
			);
	}
}
