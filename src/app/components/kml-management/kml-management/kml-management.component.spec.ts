import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KmlManagementComponent } from './kml-management.component';

describe('KmlManagementComponent', () => {
  let component: KmlManagementComponent;
  let fixture: ComponentFixture<KmlManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KmlManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KmlManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
