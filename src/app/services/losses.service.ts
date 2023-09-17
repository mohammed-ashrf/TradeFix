import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface loss {
  name: string,
  description: string,
  amount: number,
  who: string,
  createdAt: Date,
}
@Injectable({
  providedIn: 'root'
})
export class LossesService {
  private apiUrl = `${environment.apiUrl}/api/losses`;

  constructor(private http: HttpClient) { }

  getLosses(startDate?: string, endDate?: string): Observable<loss[]> {
    let url = this.apiUrl;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<loss[]>(url);
  }

  createLoss(loss: loss): Observable<loss> {
    return this.http.post<loss>(this.apiUrl, loss);
  }
}
