import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartWrapperComponent } from './flow-chart-wrapper.component';

describe('FlowChartWrapperComponent', () => {
  let component: FlowChartWrapperComponent;
  let fixture: ComponentFixture<FlowChartWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChartWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChartWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
