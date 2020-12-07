import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesGroupComponent } from './fees-group.component';

describe('FeesGroupComponent', () => {
  let component: FeesGroupComponent;
  let fixture: ComponentFixture<FeesGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
