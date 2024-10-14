import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
    NgbAccordionModule,
    NgbAlertModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgbTooltip,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { MatSliderModule } from '@angular/material/slider';
//import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { HeaderComponent } from '../../components/header/header.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
    declarations: [
       HeaderComponent,
    ],

    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MatSidenavModule,
        MatDialogModule,
        NgbNavModule,
        NgbModule,
        NgbDatepickerModule,
        NgbTooltipModule,
        NgbCollapseModule,
        NgbAccordionModule,
        MatSliderModule, 
        // NgxsFormPluginModule,
        MatTabsModule
      
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MatSidenavModule,
        MatDialogModule,
        NgbNavModule,
        NgbDatepickerModule,
        NgbCollapseModule,
        NgbAccordionModule,
        NgbTooltipModule,
        MatSliderModule, 
        // NgxsFormPluginModule,
        HeaderComponent,
        MatTabsModule
    ],
})
export class CommonDependencyModule {}
