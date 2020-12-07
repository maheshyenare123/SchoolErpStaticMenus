import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesDiscountComponent } from './fees-discount.component';

describe('FeesDiscountComponent', () => {
  let component: FeesDiscountComponent;
  let fixture: ComponentFixture<FeesDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
