export interface Product {
    _id: string;
    name: string,
    description: string,
    purchasePrice: number,
    deallerSellingPrice: number,
    deallerSellingPriceAll: number,
    userSellingPrice: number,
    category: string,
    quantity: number,
    quantitySold:number,
    purchasedate: string
    sellingdate: string,
    supplier: string,
    whatIsPaid: number,
    oweing: number,
    // buyers: Buyer[],
}
// export interface Buyer {
//     name: String,
//     number: String,
//     product: String,
//     quantity: number,
//     paid: number,
//     Owing: number,
// }

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