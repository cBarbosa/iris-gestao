import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { ImovelUnidadeType } from '../models';

import { first } from 'rxjs/internal/operators/first';

export type Attachment = {
	classificacao: string;
	dataCriacao: string;
	guidReferencia: string;
	id: number;
	local: string;
	mimeType: string;
	nome: string;
	tamanho: number;
};

export type ArquivoClassificacoes =
	| 'capa'
	| 'foto'
	| 'habitese'
	| 'projeto'
	| 'matricula'
	| 'outrosdocs';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'multipart/form-data',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class AnexoService {
	constructor(private http: HttpClient) {}

	registerFile(
		uid: string,
		formData: FormData,
		classificacao:
			| 'capa'
			| 'foto'
			| 'habitese'
			| 'projeto'
			| 'matricula'
			| 'outrosdocs'
	) {
		return this.http
			.post<ApiResponse>(
				`${env.config.apiUrl}Anexo/${uid}/classificacao/${classificacao}`,
				formData
			)
			.pipe(
				map((response) => {
					console.debug('registerFile:', response);

					if (!response.success)
						console.error('registerFile:', response.message);
					return response;
				})
			);
	}

	getFiles(guid: string) {
		return this.http.get<ApiResponse>(`${env.config.apiUrl}Anexo/${guid}`).pipe(
			map((response): Attachment[] | null => {
				console.debug('response', response);
				if (!response.success) console.error(`getFiles: ${response.message}`);
				return response.data;
			})
		);
	}

	updateFile(
		code: number,
		uid: string,
		formData: FormData,
		classificacao:
			| 'capa'
			| 'foto'
			| 'habitese'
			| 'projeto'
			| 'matricula'
			| 'outrosdocs'
	): Promise<{
		classificacao: ArquivoClassificacoes;
		response?: any;
		err?: any;
	}> {
		const deletePromise = new Promise<ApiResponse>((res, rej) => {
			this.deleteFile(code)
				.pipe(first())
				.subscribe({
					next: (response) => {
						console.debug('updateFile: ', response);

						if (response.success) {
							console.debug('file deleted');
							res(response);
							return response;
						}

						rej(response);
						return response;
					},
					error(err) {
						console.error('updateFile: ', err);
						rej(err);
						return err;
					},
				});
		});

		// return Promise.reject({ classificacao, err: 'mensagem erro teste 1' });

		return new Promise<{
			classificacao: ArquivoClassificacoes;
			response?: any;
			err?: any;
		}>((res, rej) => {
			deletePromise
				.then((response) => {
					if (response.success) {
						console.debug('file deleted');
						this.registerFile(uid, formData, classificacao)
							.pipe(first())
							.subscribe({
								next(response) {
									if (response.success) res({ classificacao, response });
									else rej({ classificacao, response, err: response.message });
								},
								error(err) {
									rej({ classificacao, err });
								},
							});
					} else {
						rej({ classificacao, err: response.message });
					}

					console.error('updateFile: ', response);
				})
				.catch((err) => {
					console.error('updateFile: ', err);

					rej({ classificacao, err });
				});
		});
	}

	registerUpdateFile(
		attachmentsObj:
			| Partial<{
					capa: Attachment;
					foto: Attachment[];
					habitese: Attachment;
					projeto: Attachment;
					matricula: Attachment;
					outrosdocs: Attachment[];
			  }>
			| undefined,
		guid: string,
		formData: FormData,
		classificacao: ArquivoClassificacoes
	): Promise<{
		classificacao: ArquivoClassificacoes;
		response?: any;
		err?: any;
	}> | null {
		if (!attachmentsObj) return null;

		if (classificacao === 'foto' || classificacao === 'outrosdocs') return null;

		if (attachmentsObj[classificacao] != null) {
			console.debug('updating');
			return this.updateFile(
				(attachmentsObj[classificacao] as Attachment).id,
				guid,
				formData,
				classificacao
			);
		} else {
			return new Promise((res, rej) => {
				this.registerFile(guid, formData, classificacao)
					.pipe(first())
					.subscribe({
						next(response) {
							console.log('registerUpdateFile', response);
							if (response.success) res({ classificacao, response });
							else rej({ classificacao, response, err: response.message });
						},
						error(err) {
							console.log('registerUpdateFile err', err);
							rej({ classificacao, err });
						},
					});
			});
		}
	}

	deleteFile(code: number) {
		console.debug('deleting file');
		return this.http
			.delete<ApiResponse>(`${env.config.apiUrl}Anexo/${code}`)
			.pipe(
				map((response) => {
					console.debug('deleteFile response', response);
					if (!response.success)
						console.error(`deleteFile: ${response.message}`);
					return response;
				})
			);
	}
}
