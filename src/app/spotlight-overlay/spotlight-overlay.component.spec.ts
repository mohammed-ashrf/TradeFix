import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotlightOverlayComponent } from './spotlight-overlay.component';

describe('SpotlightOverlayComponent', () => {
  let component: SpotlightOverlayComponent;
  let fixture: ComponentFixture<SpotlightOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotlightOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotlightOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
