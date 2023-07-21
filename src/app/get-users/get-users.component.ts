import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.scss']
})
export class GetUsersComponent implements OnInit{
  searchTerm!: any;
  searchResults!: any[];
  users :any;
  isSearched:boolean = false;
  searchResult!:any[];
  product: any;
  quantity = 1;
  user: any;
  selectedCartId: number = 0;
  
  constructor(private authService: AuthService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    localStorage.setItem("location", "Users");
    this.user = localStorage.getItem('user');
    this.authService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  goBack() {
    var user = JSON.parse(this.user);
    if(user) {
      if (user.role === 'receiver') {
        this.router.navigate(['/devices']);
      } else if (user.role === 'technition') {
        this.router.navigate(['/userDashboard']);
      }else {
        this.router.navigate(['/admin']);
      }
    }else {
      this.location.back();
    }
  }
  searchUsers(products: any[], userInput: any) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return products.filter(product => {
        for (let key in product) {
          if (product.hasOwnProperty(key) && product[key]?.toString().toLowerCase().includes(userInput.toLowerCase())) {
            // this.searchResults.push(device);
            const value = product[key].toString().toLowerCase();
            if (value.includes(userInput)) {
              this.isSearched = true;
              return true;
            }
            break;
          }
        }
        return false;
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  testInput(str: string) {
    return /[A-Za-z0-9\s\S]+/.test(str);
  }

  search() {
      this.searchResult = this.searchUsers(this.users, this.searchTerm);
  }

  // onDelete(id: string): void {
  //   if (confirm('Are you sure you want to delete this device?')) {
  //     this.authService.delete(id).subscribe(() => {
  //       this.devices = this.devices.filter((device) => device._id !== id);
  //     });
  //   }
  // }
}
