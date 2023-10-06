import { Component } from '@angular/core';
import { SwUpdate,VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { SpotlightServiceService } from './spotlight-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Trade&Fix';

  update: boolean = false;
  constructor(updates: SwUpdate,private spotlightService: SpotlightServiceService) {
    updates.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({ type: 'UPDATE_AVAILABLE', current: evt.currentVersion, available: evt.latestVersion, }))
      ).subscribe(event => {
        updates.activateUpdate().then(() => document.location.reload());
    })
  }

  activateSpotlight() {
    this.spotlightService.showSpotlight();
  }
}
