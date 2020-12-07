import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInformationsComponent } from './student-informations.component';

describe('StudentInformationsComponent', () => {
  let component: StudentInformationsComponent;
  let fixture: ComponentFixture<StudentInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInformationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
