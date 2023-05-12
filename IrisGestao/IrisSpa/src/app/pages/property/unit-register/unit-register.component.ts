import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { Imovel, ImovelUnidadeType } from 'src/app/shared/models';
import { DominiosService, ImovelService } from 'src/app/shared/services';
import { AnexoService } from 'src/app/shared/services/anexo.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';

import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-unit-register',
	templateUrl: './unit-register.component.html',
	styleUrls: ['./unit-register.component.scss'],
})
export class UnitRegisterComponent implements OnInit {
	registerForm: FormGroup;
	propertyGuid: string = '';
	isLoadingView: boolean = false;
	isLoadingSubmit: boolean = false;
	property: Imovel;
	unitTypes: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	selectedFiles: File[] = [];
	selectedPhotos: File[] = [];

	isMobile = false;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private location: Location,
		private imovelService: ImovelService,
		private dominiosService: DominiosService,
		private anexoService: AnexoService,
		private router: Router,
		private responsiveService: ResponsiveService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.propertyGuid = paramMap.get('uid') ?? '';
		});

		this.registerForm = this.fb.group({
			name: ['', Validators.required],
			nameCompany: [{ value: '', disabled: true }],
			category: [{ value: '', disabled: true }],
			type: [null, [Validators.required]],
			typeStr: [{ value: '', disabled: true }],
			proprietary: [{ value: '', disabled: true }, [Validators.required]],
			area_total: [''],
			area_usable: [''],
			area_occupancy: [''],
			occupancy: [''],
			iptu: [''],
			neoenergia: [''],
			caesb: [''],
			administration: [''],
			potential: [''],
		});
	}

	ngOnInit(): void {
		this.getData();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.registerForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: any = null) {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			// Object.keys(this.proposalForm.controls).forEach(key => {
			// 	this.proposalForm.get(key)?.markAsDirty()
			// })
			return;
		}

		this.saveChanges();
	}

	goBack() {
		this.location.back();
	}

	saveChanges(): void {
		this.isLoadingSubmit = true;

		var data = {
			IdTipoUnidade: this.registerForm.get('type')?.value,
			Tipo: this.registerForm.get('name')?.value,
			AreaUtil: +this.registerForm.get('area_usable')?.value,
			AreaTotal: +this.registerForm.get('area_total')?.value,
			AreaHabitese: +this.registerForm.get('area_occupancy')?.value,
			Matricula: this.registerForm.get('occupancy')?.value,
			InscricaoIptu: this.registerForm.get('iptu')?.value,
			MatriculaEnergia: this.registerForm.get('neoenergia')?.value,
			MatriculaAgua: this.registerForm.get('caesb')?.value,
			TaxaAdministracao: +this.registerForm.get('administration')?.value,
			ValorPotencial: +this.registerForm.get('potential')?.value,
			UnidadeLocada: false,
		} as ImovelUnidadeType;

		const newi = this.imovelService
			.createUnit(this.propertyGuid, data)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Cadastro realizado com sucesso',
							message: response.message,
						};

						const photoSubmit = this.savePhotos(response.data.guidReferencia);
						const docSubmit = this.saveDocs(response.data.guidReferencia);

						Promise.all([photoSubmit, docSubmit])
							.then((response) => {
								console.log('Upload de arquivos: ', response);
							})
							.catch((err) => {
								console.error('Erro no upload de arquivos: ', err);
							})
							.finally(() => {
								this.openModal();
							});
					} else {
						this.modalContent = {
							header: 'Cadastro não realizada',
							message: response.message,
							isError: true,
						};

						this.isLoadingSubmit = false;
						this.openModal();
					}
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Cadastro não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.isLoadingSubmit = false;
					this.openModal();
				},
			});
	}

	getData(): void {
		this.isLoadingView = true;

		const view = this.imovelService
			.getProperty(this.propertyGuid)
			?.pipe(first())
			.subscribe((imovel: Imovel) => {
				this.property = imovel;
				this.isLoadingView = false;

				this.registerForm.patchValue({
					nameCompany: imovel.nome,
					category: imovel.idCategoriaImovelNavigation?.nome,
					type: imovel.unidade?.[0]?.idTipoUnidadeNavigation?.id,
					typeStr: imovel.unidade?.[0]?.idTipoUnidadeNavigation?.nome,
					proprietary: imovel.idClienteProprietarioNavigation?.nome,
				});

				this.isLoadingView = false;

				this.getListTypes();
			});
	}

	getListTypes(): void {
		this.dominiosService.getTipoUnidade().subscribe((event) => {
			if (event) {
				event.data.forEach((item: any) => {
					this.unitTypes.push({
						label: item.nome,
						value: item.id,
					});
				});
				this.registerForm.controls['type'].setValue(
					this.property?.unidade?.[0]?.idTipoUnidadeNavigation?.id ?? null
				);
			}
		});
	}

	onAttachmentSelect(fileList: File[]) {
		this.selectedFiles = fileList;
	}

	onPhotoSelect(fileList: File[]) {
		this.selectedPhotos = fileList;
		console.log(this.selectedPhotos);
	}

	savePhotos(unitGuid: string) {
		if (this.selectedPhotos.length === 0) return null;

		const formData = new FormData();

		this.selectedPhotos.forEach((file) => {
			formData.append('files', file);
		});

		console.debug('sending', formData);

		return new Promise<{
			classificacao: 'foto';
			response?: any;
			err?: any;
		}>((res, rej) => {
			this.anexoService
				.registerFile(unitGuid, formData, 'foto')
				.pipe(first())
				.subscribe({
					next(response) {
						if (response.success) res({ classificacao: 'foto', response });
						else
							rej({ classificacao: 'foto', response, err: response.message });
					},
					error(err) {
						rej({ classificacao: 'foto', err });
					},
				});
		});
	}

	saveDocs(unitGuid: string) {
		if (this.selectedFiles.length === 0) return;

		const formData = new FormData();

		this.selectedFiles.forEach((file) => {
			formData.append('files', file);
		});

		console.debug('sending', formData);

		return new Promise<{
			classificacao: 'outrosdocs';
			response?: any;
			err?: any;
		}>((res, rej) => {
			this.anexoService
				.registerFile(unitGuid, formData, 'outrosdocs')
				.pipe(first())
				.subscribe({
					next(response) {
						if (response.success)
							res({ classificacao: 'outrosdocs', response });
						else
							rej({
								classificacao: 'outrosdocs',
								response,
								err: response.message,
							});
					},
					error(err) {
						rej({ classificacao: 'outrosdocs', err });
					},
				});
		});
	}

	openModal() {
		console.log('openning modal');
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);

		if (this.isLoadingSubmit)
			this.navigateTo('property/details/' + this.propertyGuid);
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
