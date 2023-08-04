import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { ContratoAluguel } from '../models/contrato-aluguel.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class RentContractService {
	constructor(private http: HttpClient) {}

	getContracts(
		limit: number = 50,
		page: number = 1,
		idTipoImovel?: number,
		idBaseReajuste?: number,
		dthInicioVigencia?: string,
		dthFimVigencia?: string,
		numeroContrato?: number
	) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}ContratoAluguel?limit=${limit}&page=${page}${
					idTipoImovel ? `&idTipoImovel=${idTipoImovel}` : ''
				}${idBaseReajuste ? `&idBaseReajuste=${idBaseReajuste}` : ''}${
					dthInicioVigencia ? `&dthInicioVigencia=${dthInicioVigencia}` : ''
				}${dthFimVigencia ? `&dthFimVigencia=${dthFimVigencia}` : ''}${
					numeroContrato ? `&numeroContrato=${numeroContrato}` : ''
				}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContracts: ${response.message}`);
					return response;
				})
			);
	}

	getContractByGuid(contractGuid: string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}ContratoAluguel/${contractGuid}/guid`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContractByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerContract(contractObj: ContratoAluguel) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}ContratoAluguel/Criar`,
			JSON.stringify(contractObj, null, 2),
			httpOptions
		);
	}

	adjustContract(guid: string, percentual: number) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}ContratoAluguel/${guid}/${percentual}/reajustar-contrato`,
			'',
			httpOptions
		);
	}

	editContract(guid: string, contractObj: ContratoAluguel) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}ContratoAluguel/${guid}/Atualizar`,
			JSON.stringify(contractObj, null, 2),
			httpOptions
		);
	}

	getActiveOwners() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}ContratoAluguel/lista-proprietarios`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getListaProprietariosNew: ${response.message}`);
					return response;
				})
			);
	};


	getActiveProperties() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}ContratoAluguel/lista-imoveis`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getListaProprietariosNew: ${response.message}`);
					return response;
				})
			);
	};

	getActiveUnitType() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}ContratoAluguel/lista-tipo-imoveis`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getListaProprietariosNew: ${response.message}`);
					return response;
				})
			);
	};
}
