import { ImovelUnidadeTipo } from "./imovel-unidade-tipo.model";
import { Imovel } from "./imovel.model";

export class ImovelUnidade {
    constructor(
        public id: number,
        public idImovel: number,
        public tipo: string,
        public areaUtil?: number,
        public areaTotal?: number,
        public areaHabitese?:number,
        public inscricaoIPTU?: string,
        public matricula?: string,
        public matriculaEnergia?: string,
        public matriculaAgua?: string,
        public taxaAdministracao?: number,
        public valorPotencial?: number,
        public unidadeAlocada?: boolean,
        public guidReferencia?: string,
        public dataCriacao?: Date,
        public dataUltimaModificacao?: Date,
        public idImovelNavigation?: Imovel,
        public unidadeLocada?: boolean,
        public idTipoUnidadeNavigation?: ImovelUnidadeTipo
    ) { }
}

export type ImovelUnidadeType = {
    Tipo: string;
    IdTipoUnidade: number;
    AreaUtil: number;
    AreaTotal: number;
    AreaHabitese: number;
    Matricula: string;
    InscricaoIptu: string;
    MatriculaEnergia: string;
    MatriculaAgua: string;
    TaxaAdministracao: number;
    ValorPotencial: number;
    UnidadeLocada: boolean;
};
