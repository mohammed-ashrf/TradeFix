import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { User } from '../../user';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  role = 'technition';
  confirmPassword = '';

  constructor(private authService: AuthService, 
    private route: ActivatedRoute,
    private location: Location,
    ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.authService.getUserById(id).subscribe(
        (user) => {
          this.username = user.username;
          this.email = user.email;
          this.role = user.role;
        }
      )
    }
  }

  goBack(): void {
    this.location.back();
  }
  submit(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }else {
      const user: User = { username: this.username, email: this.email, password: this.password, role: this.role };
      this.authService.register(user).subscribe(
        (data) => {
          this.authService.setToken(data.token);
          window.alert('user added to the datatbase');
        },
        (error) => {
          console.error(error);
          window.alert(`try again: ${JSON.stringify(error)}`);
        }
      );
      this.username = '';
      this.email = '';
      this.password = '';
      this.role = '';
      this.confirmPassword = '';
    }
  }
}