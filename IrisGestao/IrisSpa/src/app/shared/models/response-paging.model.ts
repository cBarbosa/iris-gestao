
export class ResponsePaging {
    constructor(
        public totalCount: number,
        public page?: number,
        public pageSize?: number,
        public items?: any[]
    ) { }
};
