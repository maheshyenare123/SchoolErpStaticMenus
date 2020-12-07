import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesCollectionComponent } from './fees-collection.component';

describe('FeesCollectionComponent', () => {
  let component: FeesCollectionComponent;
  let fixture: ComponentFixture<FeesCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
