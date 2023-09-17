import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../auth/user';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  user!: User;
  constructor(private authService: AuthService,
    private router: Router){
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        this.user = JSON.parse(currentUser);
      }
    }
  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
