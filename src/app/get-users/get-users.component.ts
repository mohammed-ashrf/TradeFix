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
  searchProperty: string = 'username';
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
    this.location.back();
  }

  searchUsers(users: any[], userInput: any, searchProperty: string) {
    try {
      if (typeof userInput !== 'string') {
        console.log('User input must be a string');
        throw new Error('User input must be a string');
      }
      userInput = userInput.toLowerCase();
      return users.filter(user => {
        if (user.hasOwnProperty(searchProperty) && user[searchProperty]?.toString().toLowerCase().includes(userInput)) {
          this.isSearched = true;
          return true;
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
      this.searchResult = this.searchUsers(this.users, this.searchTerm, this.searchProperty);
  }

  deleteUser(id: string){
    this.authService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter((item: { _id: string; }) => item._id !== id);
      }
    );
  }
}
