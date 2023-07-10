export interface Product {
    _id: '';
    name: String,
    description: String,
    purchasePrice: number,
    deallerSellingPrice: number,
    deallerSellingPriceAll: number,
    userSellingPrice: number,
    category: String,
    quantity: number,
    quantityToSell: number;
    purchasedate: String
    sellingdate: String,
    supplier: String,
    whatIsPaid: number,
    oweing: number,
    buyers: [Buyer],
}
export interface Buyer {
    name: String,
    number: String,
    product: String,
    quantity: number,
    paid: number,
    Owing: number,
}

export interface Query {
    repaired: boolean,
    paidAdmissionFees: boolean,
    delivered: boolean,
    returned: boolean,
    inProgress: boolean,
    newDevices: boolean,
    today: boolean,
    thisMonth: boolean,
    thisYear: boolean,
    specificYear: string,
    engineer: string,
    priority: string,
}

export interface SoldProduct {
    productId: string;
    quantity: number;
}
  
export interface PurchasedProduct {
    product: Product;
    quantity: number;
}