import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KmlManagementComponent } from '../../components/kml-management/kml-management/kml-management.component';

const routes: Routes = [
    {
        path: '',
        component: KmlManagementComponent,
        data: {
            title: 'Kml-Management',
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KmlManagementRoutingModule {}
