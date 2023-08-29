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
		IdTipoArea?: number,
	) {
		const optionalClause:any = {};

		if(IdLocador) {
			optionalClause.IdLocador=IdLocador;
		}

		if(IdTipoArea) {
			optionalClause.IdTipoArea = IdTipoArea;
		}

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/financial-vacancy`, {
				params: {
					DateRefInit,
					DateRefEnd,
					...optionalClause
				},
			})
			.pipe(
				map((response) => {
					console.log('getFinancialVacancy response', response);
					if (!response.success)
						console.error(`getFinancialVacancy: ${response.message}`);
					return response;
				})
			);
	};

	getPhysicalVacancy(
		DateRefInit: string,
		DateRefEnd: string,
		IdLocador?: number
	) {

		const optionalClause:any = {};

		if(IdLocador) {
			optionalClause.IdLocador=IdLocador;
		}

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/physical-vacancy`, {
				params: {
					DateRefInit,
					DateRefEnd,
					...optionalClause
				},
			})
			.pipe(
				map((response) => {
					console.log('getPhysicalVacancy response', response);
					if (!response.success)
						console.error(`getPhysicalVacancy: ${response.message}`);
					return response;
				})
			);
	};

	getReceivingPerformance(
		DateRefInit: string,
		DateRefEnd: string,
		IdLocador?: number
	) {

		const optionalClause:any = {};

		if(IdLocador) {
			optionalClause.IdLocador=IdLocador;
		}

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/receiving-performance`, {
				params: {
					DateRefInit,
					DateRefEnd,
					...optionalClause
				},
			})
			.pipe(
				map((response) => {
					console.log('getPhysicalVacancy response', response);
					if (!response.success)
						console.error(`getPhysicalVacancy: ${response.message}`);
					return response;
				})
			);
	};

	getAreaPrice(
		DateRefInit: string,
		DateRefEnd: string,
		IdLocador?: number
	) {
		const optionalClause:any = {};

		if(IdLocador) {
			optionalClause.IdLocador=IdLocador;
		}

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/area-price`, {
				params: {
					DateRefInit,
					DateRefEnd,
					...optionalClause
				},
			})
			.pipe(
				map((response) => {
					console.log('getAreaPrice response', response);
					if (!response.success)
						console.error(`getAreaPrice: ${response.message}`);
					return response;
				})
			);
	};

	getManagedArea(
		DateRefInit: string,
		DateRefEnd: string,
		IdLocador?: number
	) {
		const optionalClause:any = {};

		if(IdLocador) {
			optionalClause.IdLocador=IdLocador;
		}

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Dashboard/total-managed-area`, {
				params: {
					DateRefInit,
					DateRefEnd,
					...optionalClause
				},
			})
			.pipe(
				map((response) => {
					console.log('getManagedArea response', response);
					if (!response.success)
						console.error(`getManagedArea: ${response.message}`);
					return response;
				})
			);

	};

}
