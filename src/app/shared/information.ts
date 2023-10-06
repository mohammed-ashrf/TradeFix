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


export interface SupplierProductsInformaitons {
    quantity: number,
    purchasePrice: number,
    purchasedate: string,
    whatIsPaid: number,
    oweing: number,
    _id: string,
}
export interface SupplierProducts {
    productId: string,
    productName: string,
    infromations: SupplierProductsInformaitons[],
    _id: string,
}

export interface Supplier {
    name: string,
    owner: string,
    whatsappNumber: string,
    address: string,
    phone: string,
    notes: string,
    cash: number,
    owing: number,
    products: SupplierProducts[],
    _id: string,
}

export interface Dealer {
    name: string,
    owner: string,
    whatsappNumber: string,
    address: string,
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