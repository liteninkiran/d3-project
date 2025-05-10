import * as moment from "moment";

export type DatastoreSearch = {
    help: string;
    success: boolean | string;
    result: Result;
}

export type DatastoreSearchSql = {
    help: string;
    success: boolean;
    result: DatastoreSearch;
}

export type Result = {
    include_total?: boolean;
    resource_id?: string;
    fields: Field[];
    records_format?: string;
    records: Record[];
    _links?: Link;
    total?: number;
}

export type Field = {
    type: string;
    id: string;
}

export type Record = {
    BNF_CODE: string;
    TOTAL_QUANTITY: number;
    POSTCODE: string;
    YEAR_MONTH: number;
    UNIDENTIFIED: boolean;
    PRACTICE_NAME: string;
    ICB_NAME: string;
    BNF_CHAPTER_PLUS_CODE: string;
    ICB_CODE: string;
    ACTUAL_COST: number;
    QUANTITY: number;
    REGIONAL_OFFICE_CODE: string;
    ITEMS: number;
    ADDRESS_4: string;
    ADDRESS_1: string;
    ADDRESS_2: string;
    ADDRESS_3: string;
    BNF_CHEMICAL_SUBSTANCE: string;
    ADQUSAGE: number;
    PCO_CODE: string;
    REGIONAL_OFFICE_NAME: string;
    NIC: number;
    CHEMICAL_SUBSTANCE_BNF_DESCR: string;
    PRACTICE_CODE: string;
    PCO_NAME: string;
    BNF_DESCRIPTION: string;
}

export type Link = {
    start: string;
    next: string;
}

export type FilterOptions = {
    startDate: moment.Moment;
    endDate: moment.Moment;
    practiceCode: string;
    bnfCode: string;
    concurrent: number;
}

export const defaultOptions: FilterOptions = {
    startDate: moment('2024-01-01'),
    endDate: moment('2024-12-01'),
    practiceCode: 'J83601',
    bnfCode: '0407010H0AAAMAM',
    // bnfCode: '0604011G0BIABAU',
    // bnfCode: '0602010V0AABXBX',
    // bnfCode: '0209000A0AAABAB',
    // bnfCode: '0209000C0AAAAAA',
    concurrent: 5,
}

export type MonthData = {
    YEAR_MONTH: number;
    TOTAL_QUANTITY: number;
}
