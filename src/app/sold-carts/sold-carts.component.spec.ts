import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldCartsComponent } from './sold-carts.component';

describe('SoldCartsComponent', () => {
  let component: SoldCartsComponent;
  let fixture: ComponentFixture<SoldCartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldCartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
