import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFeesPaymentComponent } from './search-fees-payment.component';

describe('SearchFeesPaymentComponent', () => {
  let component: SearchFeesPaymentComponent;
  let fixture: ComponentFixture<SearchFeesPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFeesPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFeesPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
