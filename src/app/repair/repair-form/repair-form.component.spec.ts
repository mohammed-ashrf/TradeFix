import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairFormComponent } from './repair-form.component';

describe('RepairFormComponent', () => {
  let component: RepairFormComponent;
  let fixture: ComponentFixture<RepairFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepairFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
