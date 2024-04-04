import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";

import {HotelDetailComponent} from "./hotel-detail/hotel-detail.component";
import {hotelDetailGuard} from "./shared/guards/hotel-detail.guard";
import {HotelListComponent} from "./hotel-list/hotel-list.component";
import {HotelEditComponent} from "./hotel-edit/hotel-edit.component";
import {hotelEditGuard} from "./shared/guards/hotel-edit.guard";


@NgModule({
  /*declarations: [], ON n'a pas besoin ici*/
  imports: [
    RouterModule.forChild([
      {path: 'hotels/:id', component: HotelDetailComponent, canActivate: [hotelDetailGuard]},
      {path: 'hotels', component: HotelListComponent},
      {path:'hotels/:id/edit', component: HotelEditComponent, canDeactivate:[hotelEditGuard]}
    ]),
  ],
  exports:[RouterModule]
})
export class HotelRoutingModule {
}
