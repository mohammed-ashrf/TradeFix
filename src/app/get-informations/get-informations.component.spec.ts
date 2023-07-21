import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInformationsComponent } from './get-informations.component';

describe('GetInformationsComponent', () => {
  let component: GetInformationsComponent;
  let fixture: ComponentFixture<GetInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
