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
  id = '';
  role = 'technition';
  confirmPassword = '';
  isNew: boolean = true;
  constructor(private authService: AuthService, 
    private route: ActivatedRoute,
    private location: Location,
    ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.authService.getUserById(id).subscribe(
        (user) => {
          this.isNew = false;
          this.username = user.username;
          this.email = user.email;
          this.role = user.role;
          this.id = user._id;
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
      const user: User = {
        username: this.username, 
        email: this.email, 
        password: this.password, 
        role: this.role,
        _id: ''
      };
      if (this.isNew) {
        this.authService.register(user).subscribe(
          (data) => {
            this.authService.setToken(data.token);
            window.alert('user added to the datatbase');
            this.username = '';
            this.email = '';
            this.password = '';
            this.role = '';
            this.confirmPassword = '';
          },
          (error) => {
            console.error(error);
            window.alert(`try again: ${JSON.stringify(error)}`);
          }
        );
      } else {
        user._id = this.id;
        this.authService.updateUserById(this.id, user).subscribe(
          ()=> {
            console.log("user updated");
            window.alert(`User ${user.username} is updated.`);
          },
          (error) => {
            console.error('Error updating User:', JSON.stringify(error));
            window.alert(`Error updating User ${user.username}: ${JSON.stringify(error)}. Please try again later.`);
          }
        )
      }
    }
  }
}