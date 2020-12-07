import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffRatingComponent } from './staff-rating.component';

describe('StaffRatingComponent', () => {
  let component: StaffRatingComponent;
  let fixture: ComponentFixture<StaffRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
