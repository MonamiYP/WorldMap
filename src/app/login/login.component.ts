import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: any = null;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginService.errorSubject.subscribe((errorMessage: any) => {this.error = errorMessage;})
  }

  onKey(event: any, type: string) {
    if (type == 'username') {
      this.username = event.target.value;
    } else if (type == 'password') {
      this.password = event.target.value;      
    }
  }

  onLogin() {
    this.loginService.login(this.username, this.password).subscribe(
      (data:any) => {
        console.log(data);
      }, (err: { error: { message: any; }; }) => {
        this.error = err.error.message;}
    );
    this.router.navigateByUrl('/map');
  }
}
