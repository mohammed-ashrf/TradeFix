import { Component, HostListener, OnInit } from '@angular/core';
import { SpotlightServiceService } from '../spotlight-service.service';
@Component({
  selector: 'app-spotlight-overlay',
  templateUrl: './spotlight-overlay.component.html',
  styleUrls: ['./spotlight-overlay.component.scss']
})
export class SpotlightOverlayComponent implements OnInit {
  spotlightTargets: HTMLElement[] = []; // Array to store the spotlight target elements
  currentTargetIndex = 0; // Index of the current spotlight target
  showSpotlight = false; // Flag to control the visibility of the spotlight overlay
  searchTerm = '';
  blockInteraction = false; // Added property to block interaction
  showSuggestions = false;
  suggestions: string[] = []; // Array to hold the suggestions
  constructor(private spotlightService: SpotlightServiceService) {}
  ngOnInit() {
    this.spotlightService.spotlight$.subscribe(show => {
      this.showSpotlight = show;
      this.blockInteraction = show; // Update blockInteraction based on show
      if (show) {
        const targetElement = this.spotlightTargets[this.currentTargetIndex];
        if (targetElement) {
          targetElement.focus();
        }
      }
    });
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'f') { // Ctrl + F to trigger the spotlight
      event.preventDefault();
      this.showSpotlight = true;
      let inputElement = document.getElementById('spotlight-input');
      if (inputElement) {
        inputElement.focus();
      }
      this.blockInteraction = true;
      const targetElement = this.spotlightTargets[this.currentTargetIndex];
      if (targetElement) {
        targetElement.focus();
      }
    } else if (this.showSpotlight && event.ctrlKey && event.key === 'd') { // Escape key to hide the spotlight
      event.preventDefault();
      this.showSpotlight = false;
      this.hideSpotlight();
    }
  }

  hideSpotlight() {
    this.spotlightService.hideSpotlight();
  }

  processInput() {
    // Generate suggestions based on the search term
    this.generateSuggestions();

    // Show the suggestions if there are any
    this.showSuggestions = this.suggestions.length > 0;
  }

  generateSuggestions() {
    // Get the search type
    const type = this.getSearchType();
  
    // Remove the type and the space after it from the search term
    const searchTermWithoutType = this.searchTerm.replace(`${type} `, '');
  
    // Generate suggestions based on the search term
    switch (type) {
      case 'device':
        this.suggestions = ['laptop', 'phone', 'tablet', 'watch', 'speaker'].filter(suggestion => suggestion.includes(searchTermWithoutType));
        console.log("suggestions:"+ this.suggestions);
        break;
      case 'product':
        this.suggestions = ['book', 'shirt', 'shoes', 'groceries', 'furniture'].filter(suggestion => suggestion.includes(searchTermWithoutType));
        break;
      case 'google':
        // Search Google for the searchTermWithoutType
        const googleSearchUrl = `https://www.google.com/search?q=${searchTermWithoutType}`;
        window.open(googleSearchUrl, '_blank');
        break;
      case 'cal':
        // Perform a math operation on the equation after cal
        const equation = searchTermWithoutType;
        const result = eval(equation);
        this.suggestions = [`${equation} = ${result}`];
        break;
      case 'dev' : case 'eng': case 'mohammed younis': case 'about':
        const url = 'https://mohammedyounis.vercel.app';
        const shortUrl = 'https://tinyurl.com/mohammedyounis'
        this.suggestions = [`Made by Mohammed Younis. ${shortUrl}`];
        window.open(`${url}`,'_blank');
        break;
      default:
        this.suggestions = [];
    }
  }
  
  // Get the search type from the search term
  getSearchType() {
    const types = ['device', 'product', 'google', 'cal', 'dev', 'eng' , 'mohammed younis', 'about'];

    for (const type of types) {
      if (this.searchTerm.includes(type)) {
        return type;
      }
    }

    return '';
  }

  selectSuggestion(suggestion: string) {
    // Handle the selected suggestion here
    console.log('Selected suggestion:', suggestion);
    this.hideSpotlight();
  }
  nextTarget() {
    if (this.currentTargetIndex < this.spotlightTargets.length - 1) {
      this.currentTargetIndex++;
      const targetElement = this.spotlightTargets[this.currentTargetIndex];
      if (targetElement) {
        targetElement.focus();
      }
    }
  }

  previousTarget() {
    if (this.currentTargetIndex > 0) {
      this.currentTargetIndex--;
      const targetElement = this.spotlightTargets[this.currentTargetIndex];
      if (targetElement) {
        targetElement.focus();
      }
    }
  }
}
