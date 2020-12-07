import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStoreComponent } from './item-store.component';

describe('ItemStoreComponent', () => {
  let component: ItemStoreComponent;
  let fixture: ComponentFixture<ItemStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
