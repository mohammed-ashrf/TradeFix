export interface Product {
    _id: string;
    name: string,
    description: string,
    deallerSellingPrice: number,
    deallerSellingPriceAll: number,
    userSellingPrice: number,
    category: string,
    status: string,
    quantity: number,
    quantitySold:number,
    sellingdate: string,
    suppliers: ProductSupplier[],
}
export interface ProductSupplier {
    id: string,
    name: string,
    quantity: number,
    purchasePrice: number,
    purchasedate: string,
    whatIsPaid: number,
    oweing: number,
    informationId: string
}

// export interface Buyer {
//     name: String,
//     number: String,
//     product: String,
//     quantity: number,
//     paid: number,
//     Owing: number,
// }

export interface ProductsQuery {
    category: string,
    status: string,
    buyerType: string,
    payType: string,
    today: boolean,
    thisWeek: boolean,
    thisMonth: boolean,
    thisYear: boolean,
    specificYear: string,
    sellerName: string,
    startDate: string,
    endDate: string,
}

export interface SoldProduct {
    productId: string;
    quantity: number;
}
  
export interface PurchasedProduct {
    product: Product;
    quantity: number;
}