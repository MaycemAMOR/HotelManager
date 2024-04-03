import {NgModule} from '@angular/core';
import {HotelListComponent} from "./hotel-list/hotel-list.component";
import {HotelDetailComponent} from "./hotel-detail/hotel-detail.component";
import {RouterModule} from "@angular/router";
import {hotelDetailGuard} from "./shared/guards/hotel-detail.guard";
import {SahredModule} from '../shared/sahred.module';


@NgModule({
  declarations: [
    HotelListComponent,
    HotelDetailComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: 'hotels/:id', component: HotelDetailComponent, canActivate: [hotelDetailGuard]},
      {path: 'hotels', component: HotelListComponent},
    ]),
    SahredModule
  ]
})
export class HotelModule {
}
