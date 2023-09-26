import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isUsernameValid: boolean = false;
  error: any = null;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginService.errorSubject.subscribe((errorMessage: any) => {this.error = errorMessage;})
  }

  validateUsername(): void {
    this.isUsernameValid = false;
    const pattern = RegExp("^[A-Za-z0-9_][A-Za-z0-9_]{5,29}$");
    if (pattern.test(this.username)) {
      this.isUsernameValid = true;
    }
  }

  onKey(event: any, type: string) {
    if (type == 'username') {
      this.username = event.target.value;
      this.validateUsername();
    } else if (type == 'password') {
      this.password = event.target.value;      
    }
  }

  onLogin() {
    if (this.isUsernameValid) {
      this.loginService.login(this.username, this.password).subscribe(
        (data:any) => {
          console.log(data);
        }, (err: { error: { message: any; }; }) => {
          this.error = err.error.message;}
      );
      console.log("valid");
      this.router.navigateByUrl('/map');
    }
  }
}
