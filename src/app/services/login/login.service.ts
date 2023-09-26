import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: any = 'http://127.0.0.1:5000/login';
  errorSubject: any = new BehaviorSubject<any>(null);
  errorMessage: any = this.errorSubject.asObservable();
  

  constructor(
    private http: HttpClient, 
    private router: Router,
  ) { }

  login(username: string, password: string): any {
    return this.http.post<any>('http://127.0.0.1:5000/login', {username, password}, httpOptions);
  }
}
