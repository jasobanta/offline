import { Component } from '@angular/core';
import { KmlVisualizerComponent } from '../kml-management/kml-visualizer/kml-visualizer.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})

export class HeaderComponent {

  tabs = [
    // { label: 'Raw Data Validation', component: RawManagementComponent },
    // { label: 'Drone Log Validation',},
    {  label: 'KML-Visualizer', component: KmlVisualizerComponent },  
];

  activeTab: any;
  // public store: Store
  constructor() {
      this.activeTab = this.tabs[1]; // Set the default active tab
  }
}
