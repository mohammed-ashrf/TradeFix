import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }),
    withCredentials: true  // Include cookies in the request
  };

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password });
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, this.httpOptions)
      .pipe(
        catchError(this.handleError<User>('getUser'))
      );
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.error.message}`);
      return throwError(error.error.message);
    };
  };


  getUserById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== '';
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}