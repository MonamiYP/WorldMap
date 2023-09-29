import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RESTAPIService {
  constructor(private http: HttpClient) { }

  getCountryFROMA3(a3 : string) : Observable<Object> {
    return this.http.get('https://restcountries.com/v3.1/alpha/' + a3 + '?fields=name');
  }

  getA3FROMCountry(name : string) : Observable<Object> {
    return this.http.get('https://restcountries.com/v3.1/name/' + name + '?fullText=true&fields=cca3');
  }
}
