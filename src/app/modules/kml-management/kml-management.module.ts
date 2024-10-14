import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDependencyModule } from '../common-dependency/common-dependency.module';
import { KmlManagementRoutingModule } from './kml-management.routing.module';
import { KmlManagementComponent } from '../../components/kml-management/kml-management/kml-management.component';
import { KmlVisualizerComponent } from '../../components/kml-management/kml-visualizer/kml-visualizer.component';

@NgModule({
    declarations: [
        KmlManagementComponent,
        KmlVisualizerComponent
    ],
    imports: [
        CommonModule,
        CommonDependencyModule,
        KmlManagementRoutingModule,
    ],
    exports: [
    ],
})
export class KmlManagementModule {}
