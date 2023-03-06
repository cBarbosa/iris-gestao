import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
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
	) {
		return this.deleteFile(code)
			.pipe(first())
			.subscribe({
				next: (response) => {
					if (response.success) {
						console.debug('file deleted');
						return this.registerFile(uid, formData, classificacao).subscribe();
					}

					console.error('updateFile: ', response);
					return response;
				},
				error(err) {
					console.error('updateFile: ', err);
					return err;
				},
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
	) {
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
			return this.registerFile(guid, formData, classificacao).subscribe();
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
