
export class ImovelEndereco {
    constructor(
        public id: number,
        public idImovel: number,
        public cep?: string,
        public uf?: string,
        public cidade?: string,
        public bairro?: string,
        public rua?: string,
        public dataCriacao?: Date,
        public dataUltimaModificacao?: Date,
    ) { }
;}
