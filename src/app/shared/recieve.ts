export interface Receive {
  clientName: string;
  telnum: string;
  deviceType: string;
  section: string;
  clientSelection: string;
  complain: string;
  repair: string;
  products: product[];
  notes: string;
  productsMoney: number;
  fees: number;
  discount: number;
  total: number;
  cash: number;
  owing: number;
  finished: boolean;
  repaired: boolean;
  paidAdmissionFees: boolean;
  delivered: boolean;
  returned: boolean;
  engineer: string;
  priority: string;
  receivingDate: string;
  toDeliverDate: string;
  repairDate: string;
  _id: string;
}
export interface product {
  productId: string,
  productName: string,
  purchasePrice: number,
  productPrice: number,
  quantity: number,
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
    startDate: string,
    endDate: string
}

export const ClientSelection = ['User','Dealer'];
export const DeviceType = ['dell','acer','Asus','Mac','Lenovo','LG','Panasonic','samsong','Toshiba','Razer'];
export const section = ['soft','laptop','cs3','MB','hdd','Monitor']
