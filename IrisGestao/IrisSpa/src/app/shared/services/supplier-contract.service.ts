import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { ContratoFornecedor } from '../models/contrato-fornecedor.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class SupplierContractService {
	constructor(private http: HttpClient) {}

	getContracts(
		limit: number = 50,
		page: number = 1,
		idTipoFornecedor?: number,
		numeroContrato?: number
	) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}ContratoFornecedor?limit=${limit}&page=${page}${
					idTipoFornecedor && false
						? `&idTipoFornecedor=${idTipoFornecedor}`
						: ''
				}${numeroContrato ? `&numeroContrato=${numeroContrato}` : ''}`
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
				`${env.config.apiUrl}ContratoFornecedor/${contractGuid}/guid`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getContractByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerContract(contractObj: {
		guidImovel: string;
		guidFornecedor: string;
		idFormaPagamento: number;
		idIndiceReajuste: number;
		numeroContrato: string;
		descricaoDoServico: string;
		// percentual: number;
		dataAtualizacao: string;
		valorServicoContratado: number;
		dataInicioContrato: string;
		dataFimContrato: string;
		//diaPagamento: number;
		dataVencimentoPrimeraParcela: string;
		periodicidadeReajuste: number;
	}) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}ContratoFornecedor/Criar`,
			JSON.stringify(contractObj, null, 2),
			httpOptions
		);
	}

	editContract(
		guid: string,
		contractObj: {
			guidImovel: string;
			guidFornecedor: string;
			idFormaPagamento: number;
			idIndiceReajuste: number;
			numeroContrato: string;
			descricaoDoServico: string;
			// percentual: number;
			dataAtualizacao: string;
			valorServicoContratado: number;
			dataInicioContrato: string;
			dataFimContrato: string;
			//diaPagamento: number;
			periodicidadeReajuste: number;
		}
	) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}ContratoFornecedor/${guid}/Atualizar`,
			JSON.stringify(contractObj, null, 2),
			httpOptions
		);
	}
}
