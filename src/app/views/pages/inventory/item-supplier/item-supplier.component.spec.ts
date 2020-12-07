import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSupplierComponent } from './item-supplier.component';

describe('ItemSupplierComponent', () => {
  let component: ItemSupplierComponent;
  let fixture: ComponentFixture<ItemSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
