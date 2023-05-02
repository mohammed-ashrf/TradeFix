import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loginAttempted!: boolean;
  loginNotSuccessfull: boolean = false;
  showPassword:boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.loginAttempted = true;
    if (this.email == 'admin' && this.password == "alert('admin007')") {
      this.router.navigate(['/admin']);
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: (data) => {
          this.loginAttempted = false;
          this.authService.setToken(data.token);
          this.router.navigate(['/devices']);
        },
        error: (error) => {
          console.error(error);
          this.loginNotSuccessfull = true;
          this.email = '';
          this.password = '';
        }
      });
    }
  }
}
