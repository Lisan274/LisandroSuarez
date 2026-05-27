export interface FinancialProduct {
    id: string;
    name: string;
    description: string;
    logo: string;
    data_release: string;
    date_revision: string;
}

export interface ProductResponse {
    data: FinancialProduct[];
}

export interface ProductRespone {
    message: string;
    data: FinancialProduct[];
}