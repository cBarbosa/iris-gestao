export class Imovel {
    constructor(
        public nome?: string,
        public endereco?: string,
        public tipo?: string,
        public unidades?: number,
        public metros?: number,
    ) { }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}