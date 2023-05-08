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

  constructor(private http: HttpClient) {}

  getAll(): Observable<Receive[]> {
    return this.http.get<Receive[]>(this.apiUrl);
  }

  filterDevices(devices: Receive[], query: Query): Receive[] {
   return devices.filter(device => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const deviceReceivingDate = new Date(device.receivingDate);
        return (
          (!query.repaired || device.repaired === query.repaired) &&
          (!query.paidAdmissionFees || device.paidAdmissionFees === query.paidAdmissionFees) &&
          (!query.delivered || device.delivered === query.delivered) &&
          (!query.returned || device.returned === query.returned) &&
          (!query.inProgress || device.repaired === false) &&
          (!query.newDevices || deviceReceivingDate >= oneWeekAgo)&&
          (!query.today || deviceReceivingDate.toDateString() === new Date().toDateString()) &&
          (!query.thisMonth || deviceReceivingDate.getMonth() === new Date().getMonth()) &&
          (!query.thisYear || deviceReceivingDate.getFullYear() === new Date().getFullYear()) &&
          (!query.specificYear || deviceReceivingDate.getFullYear() === parseInt(query.specificYear))
        );
      });
    };


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
  getDeviceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/devices/${id}`);
  }

  updateDevice(id: string, updates: Receive): Observable<any> {
    return this.getDeviceById(id).pipe(
      map(device => ({ ...device, ...updates })),
      switchMap(updatedDevice => this.http.put(`${this.apiUrl}/devices/${id}`, updatedDevice))
    );
  }

  deleteDevice(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/devices/${id}`);
  }
  
  downloadReceipt() {
    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    this.http.get(`${this.apiUrl}/generate-receipt/`, { headers, responseType: 'blob' }).subscribe((data) => {
      const fileURL = URL.createObjectURL(data);
      window.open(fileURL);
    });
  }
  
}