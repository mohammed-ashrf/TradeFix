import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../services/notification.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  allProductNotifications: Notification[] = [];
  allRepairNotifications: Notification[] = [];
  showingProductNotifications: boolean = false;
  showingRepairNotifications: boolean = false;
  itemToload: number = 10;
  productNotifications: Notification[] = [];
  repairNotifications: Notification[] = [];


  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.showingProductNotifications = true;
    this.showingRepairNotifications = false;
    this.showProductNotifications();
    this.getProductNotifications();
    this.showProductNotifications();
  }

  loadOnScroll() {
    if (this.showingProductNotifications){
      const productNotificationsContainer =  document.getElementById('productNotifications');
      if (productNotificationsContainer) {
        console.log('product');
        productNotificationsContainer.addEventListener('scroll', event => {
          const { scrollHeight, scrollTop, clientHeight } = (event.target as Element);
  
          if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
              console.log('scrolled');
              if (this.allProductNotifications.length > this.productNotifications.length) {
                this.itemToload += 10;
                this.productNotifications = this.allProductNotifications.slice(0, this.itemToload);
                console.log(' scrolling loaded');
              }
          }
        });
      }
    }else if (this.showingRepairNotifications) {
      const repairNotificationsContainer = document.getElementById('repairNotifications');
      if (repairNotificationsContainer) {
        console.log('repair');
        repairNotificationsContainer.addEventListener('scroll', event => {
          const { scrollHeight, scrollTop, clientHeight } = (event.target as Element);
  
          if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
              console.log('scrolled');
              if (this.allRepairNotifications.length > this.repairNotifications.length) {
                this.itemToload += 10;
                this.repairNotifications = this.allRepairNotifications.slice(0, this.itemToload);
                console.log(' scrolling loaded');
              }
          }
        });
      }
    }
  }

  getProductNotifications(): void {
    this.notificationService.getProductNotifications()
      .subscribe(
        (notifications) => {
          this.allProductNotifications = notifications;
          this.itemToload = 10;
          this.productNotifications = this.allProductNotifications.slice(0, this.itemToload);
          console.log('loaded');
        },
        error => console.error('Failed to retrieve product notifications:', error)
      );
  }

  getRepairNotifications(): void {
    this.notificationService.getRepairNotifications()
      .subscribe(
        (notifications) => {
          this.allRepairNotifications = notifications;
          this.repairNotifications = this.allRepairNotifications.slice(0, this.itemToload);
          console.log('loaded');
        },
        error => console.error('Failed to retrieve repair notifications:', error)
      );
  }

  showProductNotifications() {
    this.showingProductNotifications = true;
    this.showingRepairNotifications = false;
    this.loadOnScroll();
  }

  showRepairNotifications() {
    this.showingProductNotifications = false;
    this.showingRepairNotifications = true;
    this.loadOnScroll();
  }

  deleteNotification(id:string, index: number){
    this.notificationService.deleteNotification(id).subscribe(
      (res) => {
        console.log(res);
        if (this.showingProductNotifications) {
          this.productNotifications.splice(index, 1);
        }else {
          this.repairNotifications.splice(index, 1);
        }
      }
    )
  }
}