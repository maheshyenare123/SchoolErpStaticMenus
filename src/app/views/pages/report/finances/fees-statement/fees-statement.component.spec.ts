import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesStatementComponent } from './fees-statement.component';

describe('FeesStatementComponent', () => {
  let component: FeesStatementComponent;
  let fixture: ComponentFixture<FeesStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
