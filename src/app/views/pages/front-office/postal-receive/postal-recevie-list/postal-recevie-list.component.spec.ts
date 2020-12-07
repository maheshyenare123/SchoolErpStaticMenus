import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostalRecevieListComponent } from './postal-recevie-list.component';

describe('PostalRecevieListComponent', () => {
  let component: PostalRecevieListComponent;
  let fixture: ComponentFixture<PostalRecevieListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostalRecevieListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostalRecevieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
