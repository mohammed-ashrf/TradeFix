import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, 
    private router: Router,
    private location: Location,
    ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
  submit(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }else {
      const user: User = { username: this.username, email: this.email, password: this.password };
    this.authService.register(user).subscribe(
      (data) => {
        this.authService.setToken(data.token);
        window.alert('user added to the datatbase');
      },
      (error) => {
        console.error(error);
        window.alert(`try again ${error}`);
      }
    );
    }
  }
}