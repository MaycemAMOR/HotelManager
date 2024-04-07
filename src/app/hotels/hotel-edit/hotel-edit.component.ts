import {AfterViewInit, Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {HotelListService} from "../shared/services/hotel-list.service";
import {IHotel} from "../shared/models/hotel";
import {GlobalGenericValidator} from "../shared/validators/global-generic.validator";
import {fromEvent, merge, Observable} from "rxjs";

@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrl: './hotel-edit.component.css'
})
export class HotelEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, {read: ElementRef}) inputElements!: ElementRef[];
  public hotelForm!: FormGroup;
  public hotel!: IHotel;
  public pageTitle!: string;
  public errorMessage!: String | null;
  public formErrors: { [key: string]: string } = {};
  public validationMessage: { [key: string]: { [key: string]: string } } = {
    hotelName: {
      required: 'Le nom de l\'hotel est obligatoire'
    },
    price: {
      required: 'Le prix de l\'hotel est obligatoire'
    }
  };

  private globalGenericValidator!: GlobalGenericValidator;

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
    this.globalGenericValidator = new GlobalGenericValidator(this.validationMessage);

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

  ngAfterViewInit(): void {
    const formControlBlurs: Observable<unknown>[] = this.inputElements
      .map((formControlElementRef: ElementRef) => fromEvent(formControlElementRef.nativeElement, 'blur'));
    merge(this.hotelForm.valueChanges, ...formControlBlurs) // merger deux observables
      .subscribe(() => {
        this.formErrors = this.globalGenericValidator.createErrorMessage(this.hotelForm);
        console.log('formulaire erros :', this.formErrors);
      })
  }

  public hideError(): void {
    this.errorMessage = null;
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
            next: () => this.saveCompleted(),
            error: (err) => this.errorMessage = err
          });
        } else {
          this.hotelService.updateHotel(hotel).subscribe({
            next: () => this.saveCompleted(),
            error: (err) => this.errorMessage = err
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
