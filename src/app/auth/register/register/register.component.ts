import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../user';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  submit(): void {
    const user: User = { username: this.username, email: this.email, password: this.password };
    this.authService.register(user).subscribe(
      (data) => {
        this.authService.setToken(data.token);
        this.router.navigate(['/devices']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}