import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDueFeesComponent } from './search-due-fees.component';

describe('SearchDueFeesComponent', () => {
  let component: SearchDueFeesComponent;
  let fixture: ComponentFixture<SearchDueFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDueFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDueFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
