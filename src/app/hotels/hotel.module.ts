import {NgModule} from '@angular/core';
import {InMemoryWebApiModule} from "angular-in-memory-web-api";

import {HotelListComponent} from "./hotel-list/hotel-list.component";
import {HotelDetailComponent} from "./hotel-detail/hotel-detail.component";
import {SahredModule} from '../shared/sahred.module';
import {HotelRoutingModule} from "./hotel-routing.module";
import {HotelEditComponent} from './hotel-edit/hotel-edit.component';
import {HotelData} from "./shared/api/hotel.data";


@NgModule({
  declarations: [
    HotelListComponent,
    HotelDetailComponent,
    HotelEditComponent
  ],
  imports: [
    SahredModule,
    HotelRoutingModule,
    InMemoryWebApiModule.forFeature(HotelData)
  ]
})
export class HotelModule {
}
