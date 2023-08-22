export interface Section {
    name: string,
    checkingFees: number,
    description: string,
    _id: string,
}

export interface ProductSection {
    name: string,
    description: string,
    _id: string,
}

export interface SupplierProducts {
    id: string,
    name: string,
    quantity: number,
    purchasePrice: number,
    purchasedate: string,
    whatIsPaid: number,
    oweing: number,
}

export interface Supplier {
    name: string,
    companyName: string,
    phone: string,
    notes: string,
    products: SupplierProducts[],
    _id: string,
}

export interface Dealer {
    name: string,
    companyName: string,
    email: string,
    phone: string,
    notes: string,
    _id: string,
}

export interface DollarPrice {
    price: number,
    date: any,
    _id: string,
}

export const adminPassword = "alert('admin007')";