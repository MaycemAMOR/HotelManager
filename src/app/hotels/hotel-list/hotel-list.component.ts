import {Component, OnInit} from "@angular/core";
import {IHotel} from "../shared/models/hotel";
import {HotelListService} from "../shared/services/hotel-list.service";

@Component({
  selector: 'app-hotel-list',
  templateUrl: 'hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  public hotels: IHotel[] = [];
  public showBadge: boolean = true;
  public filteredHotel: IHotel[] = [];
  public receivedRating: string | undefined;
  protected title: string = "Liste  Hotels";
  private _hotelListService: HotelListService;
  private errorMsg: string | undefined;

  constructor(hotelListService: HotelListService) {
    this._hotelListService = hotelListService;
  }

  private _hotelFilter = 'mot';

  public get hotelFilter(): string {
    return this._hotelFilter;
  }

  public set hotelFilter(value: string) {
    this._hotelFilter = value;
    this.filteredHotel = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
  }

  public receivedRatingCliked(message: string): void {
    this.receivedRating = message;
  }

  public toggleIsNewBadge(): void {
    this.showBadge = !this.showBadge;
  }

  ngOnInit(): void {
    this.hotelFilter = '';
    this._hotelListService.getHotels().subscribe({
      next: hotels => {
        this.hotels = hotels;
        this.filteredHotel = this.hotels;
      },
      error: err => this.errorMsg = err
    });
  }

  private filterHotels(criteria: string): IHotel[] {
    criteria = criteria.toLowerCase();
    return this.hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLowerCase().indexOf(criteria) != -1
    );
  }

}
