// import { ObjectId } from 'bson';
export interface Receive {
  clientName: string;
  telnum: string;
  deviceType: string;
  section: string;
  clientSelection: string;
  complain: string;
  notes: string;
  fees: number;
  finished: boolean;
  receivingDate: string;
  _id: '';
}

export const ClientSelection = ['User','Dealer'];
export const DeviceType = ['dell','acer','Asus','Mac','Lenovo','LG','Panasonic','samsong','Toshiba','Razer'];
export const section = ['soft','laptop','cs3','MB','hdd','VGA']
