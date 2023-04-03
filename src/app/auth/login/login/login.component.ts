// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../auth.service';
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent implements OnInit {
//   user= {username: '',password: ''};
//   constructor(private authService: AuthService, private router: Router) {}

//   ngOnInit(): void {}

//   onSubmit(): void {
//     console.log('User: ',this.user);
//     if (this.user.username == 'admin' && this.user.password == 'admin'){
//       this.router.navigate(['/devices']);
//     }else {
//       this.authService.login(this.user.username, this.user.password).subscribe(
//         (data) => {
//           this.authService.setToken(data.token);
//           this.router.navigate(['/devices']);
//         },
//         (error) => {
//           console.error(error);
//           window.alert('username or password is incorrect');
//           this.user.username = '';
//           this.user.password = '';
//         }
//       );
//     }
//   }
// }

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
    this.authService.login(this.email, this.password).subscribe(
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
