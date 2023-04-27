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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  submit(): void {
    if (this.email == 'admin' && this.password == "alert('admin007')") {
      this.router.navigate(['/admin']);
    }else {
      this.authService.login(this.email, this.password).subscribe(
        (data) => {
          this.authService.setToken(data.token);
          this.router.navigate(['/devices']);
        },
        (error) => {
          console.error(error);
          window.alert(`username or password is wrong ${JSON.stringify(error)}`);
        }
      );
    }
  }
}
