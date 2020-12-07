import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCollectComponent } from './fees-collect.component';

describe('FeesCollectComponent', () => {
  let component: FeesCollectComponent;
  let fixture: ComponentFixture<FeesCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
