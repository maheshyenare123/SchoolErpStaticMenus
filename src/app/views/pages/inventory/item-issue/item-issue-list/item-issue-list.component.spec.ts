import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIssueListComponent } from './item-issue-list.component';

describe('ItemIssueListComponent', () => {
  let component: ItemIssueListComponent;
  let fixture: ComponentFixture<ItemIssueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemIssueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
