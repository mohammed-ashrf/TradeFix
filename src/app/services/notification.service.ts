import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface Notification {
  _id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/notifications`;
  constructor(private http: HttpClient) { }
  getProductNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}-product`);
  }

  getRepairNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}-repair`);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }
}
