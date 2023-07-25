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
  fees: number;
  finished: boolean;
  repaired: boolean;
  paidAdmissionFees: boolean;
  delivered: boolean;
  returned: boolean;
  engineer: string;
  priority: string;
  receivingDate: string;
  _id: string;
}
export interface product {
  productId: string,
  productName: string,
  productPrice: number,
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

export const ClientSelection = ['User','Dealer'];
export const DeviceType = ['dell','acer','Asus','Mac','Lenovo','LG','Panasonic','samsong','Toshiba','Razer'];
export const section = ['soft','laptop','cs3','MB','hdd','Monitor']
