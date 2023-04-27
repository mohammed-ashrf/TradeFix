import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchComponent } from './admin-search.component';

describe('AdminSearchComponent', () => {
  let component: AdminSearchComponent;
  let fixture: ComponentFixture<AdminSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
