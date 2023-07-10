export interface Section {
    name: string,
    checkingFees: number,
    description: string,
    _id: string,
}

export interface Supplier {
    name: string,
    phone: string,
    _id: string,
}

export interface Dealer {
    name: string,
    email: string,
    phone: string,
    _id: string,
}

export interface DollarPrice {
    price: number,
    date: any,
    _id: string,
}