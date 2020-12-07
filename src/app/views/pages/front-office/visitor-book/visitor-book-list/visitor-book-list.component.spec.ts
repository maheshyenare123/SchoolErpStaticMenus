import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorBookListComponent } from './visitor-book-list.component';

describe('VisitorBookListComponent', () => {
  let component: VisitorBookListComponent;
  let fixture: ComponentFixture<VisitorBookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorBookListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
