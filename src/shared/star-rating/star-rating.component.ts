import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";


@Component({
  selector : 'app-star-rating',
  templateUrl :'./star-rating.component.html',
  styleUrls : ['./star-rating.component.css']
})
export class StarRatingComponent implements OnChanges {

  public starWidth!: number;

  @Input()
  public rating: number = 2;

  @Output()
  public starRatingCliked: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges() {
    this.starWidth = this.rating*125/5;
  }

  sendRating():void{
    this.starRatingCliked.emit(`la note est de ${this.rating}`);
  }

}
