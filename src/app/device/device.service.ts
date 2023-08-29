import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Receive,Query } from '../shared/recieve';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = `${environment.apiUrl}/api/devices`;
  private apiUrl2 = `${environment.apiUrl}/api/devices-delivered`;
  private pageSize = 10;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Receive[]> {
    return this.http.get<Receive[]>(this.apiUrl);
  }

  getDevicesByPage(page: number): Observable<Receive[]> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(this.pageSize));

    return this.http.get<Receive[]>(`${this.apiUrl}/bypage`, { params });
  }

  filterDevices(devices: Receive[], query: Query): Receive[] {
    return devices.filter(device => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const deviceReceivingDate = new Date(device.receivingDate);
  
      // Check if the device's receiving date is within the specified date range
      const isWithinDateRange =
        (!query.startDate || deviceReceivingDate >= new Date(query.startDate)) &&
        (!query.endDate || deviceReceivingDate <= new Date(query.endDate));
  
      return (
        isWithinDateRange &&
        (!query.repaired || device.repaired === query.repaired) &&
        (!query.paidAdmissionFees || device.paidAdmissionFees === query.paidAdmissionFees) &&
        (!query.delivered || device.delivered === query.delivered) &&
        (!query.returned || device.returned === query.returned) &&
        (!query.inProgress || device.repaired === false) &&
        (!query.engineer || device.engineer === query.engineer) &&
        (!query.priority || device.priority === query.priority) &&
        (!query.newDevices || deviceReceivingDate >= oneWeekAgo) &&
        (!query.today || deviceReceivingDate.toDateString() === new Date().toDateString()) &&
        (!query.thisMonth || deviceReceivingDate.getMonth() === new Date().getMonth()) &&
        (!query.thisYear || deviceReceivingDate.getFullYear() === new Date().getFullYear()) &&
        (!query.specificYear || deviceReceivingDate.getFullYear() === parseInt(query.specificYear))
      );
    });
  }


  getOne(id: string): Observable<Receive> {
    return this.http.get<Receive>(`${this.apiUrl}/${id}`);
  }

  create(device: Receive): Observable<Receive> {
    return this.http.post<Receive>(this.apiUrl, device);
  }

  update(id: string, device: Receive): Observable<Receive> {
    return this.http.put<Receive>(`${this.apiUrl}/${id}`, device);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getLastDevice() {
    return this.http.get<Receive>(`${this.apiUrl}-lastdevice`);
  }

  moveDeviceToDelivered(deviceId: string): Observable<any> {
    const url = `${this.apiUrl}/${deviceId}/move-to-delivered`;
    return this.http.put(url, {});
  }

  getAllDeliveredDevices(): Observable<Receive[]> {
    return this.http.get<Receive[]>(this.apiUrl2);
  }

  getDeliveredDevicesByPage(page: number): Observable<any> {
    const url = `${this.apiUrl2}/bypage`;
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(this.pageSize));

    return this.http.get(url, { params });
  }

  getOneDeliveredDevice(id: string): Observable<Receive> {
    return this.http.get<Receive>(`${this.apiUrl2}/${id}`);
  }

  deleteDeliveredDevice(deviceId: string): Observable<any> {
    const url = `${this.apiUrl2}/${deviceId}`;
    return this.http.delete(url);
  }

  updateDeliveredDevice(deviceId: string, updates: any): Observable<any> {
    const url = `${this.apiUrl2}/${deviceId}`;
    return this.http.put(url, updates);
  }

  returnDeviceToDevices(deviceId: string): Observable<any> {
    const url = `${this.apiUrl2}/${deviceId}/return-to-devices`;
    return this.http.put(url, {});
  }
  
  downloadReceipt() {
    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    this.http.get(`${this.apiUrl}/generate-receipt/`, { headers, responseType: 'blob' }).subscribe((data) => {
      const fileURL = URL.createObjectURL(data);
      window.open(fileURL);
    });
  }
  
}