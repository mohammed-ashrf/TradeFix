import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInformationsComponent } from './add-informations.component';

describe('AddInformationsComponent', () => {
  let component: AddInformationsComponent;
  let fixture: ComponentFixture<AddInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
