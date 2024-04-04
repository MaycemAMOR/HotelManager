import {NgModule} from '@angular/core';

import {HotelListComponent} from "./hotel-list/hotel-list.component";
import {HotelDetailComponent} from "./hotel-detail/hotel-detail.component";
import {SahredModule} from '../shared/sahred.module';
import {HotelRoutingModule} from "./hotel-routing.module";
import { HotelEditComponent } from './hotel-edit/hotel-edit.component';


@NgModule({
  declarations: [
    HotelListComponent,
    HotelDetailComponent,
    HotelEditComponent
  ],
  imports: [
    SahredModule,
    HotelRoutingModule
  ]
})
export class HotelModule {
}
