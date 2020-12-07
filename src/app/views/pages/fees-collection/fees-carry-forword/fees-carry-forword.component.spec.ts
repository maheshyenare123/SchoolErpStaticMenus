import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCarryForwordComponent } from './fees-carry-forword.component';

describe('FeesCarryForwordComponent', () => {
  let component: FeesCarryForwordComponent;
  let fixture: ComponentFixture<FeesCarryForwordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesCarryForwordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesCarryForwordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
