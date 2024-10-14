import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KmlManagementComponent } from './components/kml-management/kml-management/kml-management.component';

const routes: Routes = [
  {
    path: '',
    component:KmlManagementComponent,
        children: [
      {
        path: 'kml-management',
        loadChildren: () =>
            import(
                './modules/kml-management/kml-management.module'
            ).then((m) => m.KmlManagementModule),
        data: {
            title: 'Kml Management',
            nav: true,
        },
    },
    ]
  },
  // {
  //   path: '',
  //   component: RawManagementComponent,
  //   children: [
  //     {
  //       path: 'raw-management',
  //       loadChildren: () =>
  //           import(
  //               './modules/raw-management/raw-management.module'
  //           ).then((m) => m.RawManagementModule),
  //       data: {
  //           title: 'Raw Management',
  //           nav: true,
  //       },
  //   },
  //   ]
  // },
  // {
  //   path: '',
  //   component: KmlManagementComponent,
  //   children: [
  //     {
  //       path: 'kml-management',
  //       loadChildren: () =>
  //           import(
  //               './modules/kml-management/kml-management.module'
  //           ).then((m) => m.KmlManagementModule),
  //       data: {
  //           title: 'Kml Management',
  //           nav: true,
  //       },
  //   },
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

