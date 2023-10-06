import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotlightServiceService {
  private spotlightSubject = new Subject<boolean>();

  spotlight$ = this.spotlightSubject.asObservable();

  showSpotlight() {
    this.spotlightSubject.next(true);
  }

  hideSpotlight() {
    this.spotlightSubject.next(false);
  }
}
