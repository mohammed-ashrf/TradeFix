import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  searchData(term: string) {
    return this.http.get(`https://api.example.com/search?q=${term}`);
  }
}
