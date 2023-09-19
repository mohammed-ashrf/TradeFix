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
  role = 'receiver';
  confirmPassword = '';
  isNew: boolean = true;
  access: string[] = [];
  user!: User;
  permissions :Record<string, boolean> = {
    'informations': false,
    'expenses': false,
    'losses': false,
    'soldCarts': false,
  };
  permissionKeys = Object.keys(this.permissions);
  changePassword: boolean = false;
  constructor(private authService: AuthService, 
    private route: ActivatedRoute,
    private location: Location,
    ) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.isNew = false;
      this.authService.getUserById(id).subscribe(
        (user) => {
          this.username = user.username;
          this.email = user.email;
          this.role = user.role;
          this.id = user._id;
          user.access.forEach((item: string)=> {
            this.permissions[item] = true;
          });
        }
      )
    }
  }

  goBack(): void {
    this.location.back();
  }
  togglePassword() {
    if(this.changePassword === false) {
      this.changePassword = true;
    }else {
      this.changePassword = false;
    }
  }
  submit(): void {
    if (!this.changePassword) {
      this.password = '';
      this.confirmPassword = '';
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }else {
      for(let permission in this.permissions) {
        if(this.permissions[permission]) {
          this.access.push(permission);
        }
      }
      const user: User = {
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role,
        _id: '',
        access: this.access,
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
            this.access = [];
          },
          (error) => {
            console.error(error);
            window.alert(`try again: ${JSON.stringify(error)}`);
          }
        );
      } else {
        if(!this.changePassword){
          user.password = '';
        }
        this.authService.updateUserById(this.id, user).subscribe(
          (user)=> {
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