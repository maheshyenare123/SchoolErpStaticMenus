import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVehicleComponent } from './assign-vehicle.component';

describe('AssignVehicleComponent', () => {
  let component: AssignVehicleComponent;
  let fixture: ComponentFixture<AssignVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
