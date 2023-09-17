import { Component, OnInit } from '@angular/core';
import { LossesService, loss } from '../services/losses.service';
import { User } from '../auth/user';

@Component({
  selector: 'app-losses',
  templateUrl: './losses.component.html',
  styleUrls: ['./losses.component.scss']
})
export class LossesComponent implements OnInit {
  losses: loss[] = [];
  newLoss: loss = {
    name: '',
    description: '',
    amount: 0,
    who: '',
    createdAt: new Date(),
  };
  currentUser: any;
  user!: User;
  startDate!: string ;
  endDate!: string ;
  constructor(private lossesService: LossesService) { }

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('user');
    if (this.currentUser) {
      this.user = JSON.parse(this.currentUser);
      this.newLoss.who = this.user.username;
    }
    this.getLosses();
  }

  getLosses(startDate?: string, endDate?: string): void {
    this.lossesService.getLosses(startDate, endDate).subscribe(
      (losses: loss[]) => {
        this.losses = losses;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  filterLosses() {
    this.getLosses(this.startDate, this.endDate);
  }
  createLoss(): void {
    this.lossesService.createLoss(this.newLoss).subscribe(
      (loss: loss) => {
        console.log('Loss created:', loss);
        // Perform any desired action after creating a loss
        const existingLossIdx = this.losses.findIndex(exp => exp.name === loss.name);
        if (existingLossIdx !== -1) {
          this.losses[existingLossIdx] = loss;
        } else {
          this.losses.push(loss);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
