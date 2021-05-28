import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomShapeComponent } from './custom-shape.component';

describe('CustomShapeComponent', () => {
  let component: CustomShapeComponent;
  let fixture: ComponentFixture<CustomShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
