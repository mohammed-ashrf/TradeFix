import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableRightClick]'
})
export class DisableRightClickDirective {
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    return false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      event.ctrlKey &&
      (event.key === 'U' || event.key === 'E') ||
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && event.key === 'C')
    ) {
      event.preventDefault();
    }
  }
}
