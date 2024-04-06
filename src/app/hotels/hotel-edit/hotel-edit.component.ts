import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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

  public get tags(): FormArray {
    return this.hotelForm.get('tags') as FormArray;
  }

  ngOnInit(): void {
    this.hotelForm = this.fb.group({
      hotelName: ['', Validators.required],
      price: ['', Validators.required],
      rating: [''],
      description: [''],
      tags: this.fb.array([])
    });
    this.route.paramMap.subscribe(params => {
      // @ts-ignore
      const id = +params.get('id');
      console.log('id de  hotel à editer : ' + id);
      this.getSelectedHotel(id);
    });
  }

  public addTags(): void {
    this.tags.push(new FormControl());
  }

  public deleteTags(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty(); // pour informer au formulaire globale que ce tag a été retirer
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
        description: '',
      });
    } else {
      this.pageTitle = `Edition de l\'hotel ${this.hotel.hotelName}`;
      this.hotelForm.patchValue({
        hotelName: this.hotel.hotelName,
        price: this.hotel.price,
        rating: this.hotel.rating,
        description: this.hotel.description,
      });
    }
    this.hotelForm.setControl('tags', this.fb.array(this.hotel.tags || []))


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

  public deletHotel(): void {
    if (confirm(`Voulez vous réelement supprimer ${this.hotel.hotelName} ?`)) {
      this.hotelService.deleteHotel(<number>this.hotel.id).subscribe({
        next: () => this.saveCompleted()
      })
    }
  }

  public saveCompleted() {
    this.hotelForm.reset();
    this.router.navigate(['/hotels']);

  }
}
