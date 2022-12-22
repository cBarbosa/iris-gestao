export class ImovelUnidade {
    constructor(
        public id: number,
        public idImovel: number,
        public tipo: string,
        public areaUtil?: number,
        public areaTotal?: number,
        public areaHabitese?:number,
        public inscricaoIPTU?: string,
        public matriculaEnergia?: string,
        public matriculaAgua?: string,
        public taxaAdministracao?: number,
        public valorPotencial?: number,
        public unidadeAlocada?: boolean,
        public guidReferencia?: string,
        public dataCriacao?: Date,
        public dataUltimaModificacao?: Date
    ) { }
}
