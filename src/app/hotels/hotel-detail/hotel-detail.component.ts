import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HotelListService} from "../shared/services/hotel-list.service";
import {IHotel} from "../shared/models/hotel";

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.css'
})
export class HotelDetailComponent implements OnInit {
  public hotel: IHotel | undefined = <IHotel>{};

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    // @ts-ignore
    const id: number = +this.route.snapshot.paramMap.get('id');
    console.log('id: ', id);
    this.hotelService.getHotels().subscribe((hotels: IHotel[]) => {
      this.hotel = hotels.find(hotel => hotel.hotelId == id);
      console.log('hotel ', this.hotel);
    })
  }


  public backToList(): void {
    this.router.navigate(['/hotels']);
  }
}
