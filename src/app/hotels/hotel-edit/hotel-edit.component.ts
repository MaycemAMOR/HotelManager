import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HotelListService} from "../shared/services/hotel-list.service";
import {IHotel} from "../shared/models/hotel";

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrl: './hotel-edit.component.css'
})
export class HotelEditComponent implements OnInit {
  public hotelForm!: FormGroup;
  public hotel!: IHotel;
  public pageTitle!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private hotelService: HotelListService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.hotelForm = this.fb.group({
      hotelName: ['', Validators.required],
      price: ['', Validators.required],
      rating: [''],
      description: ['']
    });
    this.route.paramMap.subscribe(params => {
      // @ts-ignore
      const id = +params.get('id');
      console.log('id de  hotel à editer : ' + id);
      this.getSelectedHotel(id);
    });
  }

  public getSelectedHotel(id: number): void {
    this.hotelService.getHotelById(id).subscribe((hotel: IHotel) => {
      console.log(hotel);
      this.displayHotel(hotel);
    });
  }

  public displayHotel(hotel: IHotel): void {
    this.hotel = hotel;
    if (this.hotel.id == 0) {
      this.pageTitle = "Création d'un hotel";
      this.hotelForm.patchValue({
        hotelName: '',
        price: '',
        rating: '',
        description: ''
      })
    } else {
      this.pageTitle = `Edition de l\'hotel ${this.hotel.hotelName}`;
      this.hotelForm.patchValue({
        hotelName: this.hotel.hotelName,
        price: this.hotel.price,
        rating: this.hotel.rating,
        description: this.hotel.description
      })
    }


  }

  public saveHotel(): void {
    if (this.hotelForm.valid) { // si mon formulaire est valid
      if (this.hotelForm.dirty) { //si au min il y a un element dans mon formulaire
        const hotel: IHotel = { // remplacer les valeur qui sont dans notre formulaire dans l'objet hotel créé deja dans la fonction displayHotel
          ...this.hotel,
          ...this.hotelForm.value
        };
        if (hotel.id == 0) { // tester si on est entrain de créer un nouveau hotel ou mettre à jour un hotel existant
          this.hotelService.createHotel(hotel).subscribe({
            next: () => this.saveCompleted()
          });
        } else {
          this.hotelService.updateHotel(hotel).subscribe({
            next: () => this.saveCompleted()
          });

        }
      }
    }

    console.log(this.hotelForm.value);
  }

  public saveCompleted() {
    this.hotelForm.reset();
    this.router.navigate(['/hotels']);

  }
}
