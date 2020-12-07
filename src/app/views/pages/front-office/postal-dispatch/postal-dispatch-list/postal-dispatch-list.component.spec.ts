import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostalDispatchListComponent } from './postal-dispatch-list.component';

describe('PostalDispatchListComponent', () => {
  let component: PostalDispatchListComponent;
  let fixture: ComponentFixture<PostalDispatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalDispatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalDispatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
