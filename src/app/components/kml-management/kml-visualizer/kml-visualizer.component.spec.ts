import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmlVisualizerComponent } from './kml-visualizer.component';

describe('KmlVisualizerComponent', () => {
  let component: KmlVisualizerComponent;
  let fixture: ComponentFixture<KmlVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KmlVisualizerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KmlVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
