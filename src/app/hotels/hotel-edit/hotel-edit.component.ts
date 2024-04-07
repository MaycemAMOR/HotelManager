import {AfterViewInit, Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {debounce, fromEvent, merge, Observable, timer} from "rxjs";

import {HotelListService} from "../shared/services/hotel-list.service";
import {IHotel} from "../shared/models/hotel";
import {GlobalGenericValidator} from "../shared/validators/global-generic.validator";
import {NumberValidators} from "../shared/validators/number.validator";


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
      required: 'Le nom de l\'hotel est obligatoire',
      minlength: 'Le nom de l\'hotel  doit comporter au moin 4 caractéres ',
    },
    price: {
      required: 'Le prix de l\'hotel est obligatoire',
      pattern: 'Le prix de l\'hotel doit être un nombre'
    },
    rating: {
      range: 'Donnez une note entre 1 et 5',
      // pattern: 'Le prix de l\'hotel doit être un nombre'
    }
  };

  private globalGenericValidator!: GlobalGenericValidator;
  private isFomSubmitted!: boolean;

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
      hotelName: ['', [Validators.required, Validators.minLength(4)]],
      price: ['',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      rating: ['', NumberValidators.range(1, 5)],
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
    console.log('isFomSubmitted', this.isFomSubmitted);
    const formControlBlurs: Observable<unknown>[] = this.inputElements
      .map((formControlElementRef: ElementRef) => fromEvent(formControlElementRef.nativeElement, 'blur'));
    merge(this.hotelForm.valueChanges, ...formControlBlurs) // merger deux observables
      .pipe(
        //debounceTime(800) // ==> pour eviter une la tence entre l'apparution de l'erreur globle
        // et ceux de chaque input dans le cas de sauvgard d'un formulaire vide pour cela
        // j'utlise la ligne suivante pour tester isFomSubmitted est true si oui les erreurs
        // de chaque input vont etre verifier et emis immidiatement si isFomSubmitted est false
        // c'est a dire dans ce cas que l'utilisateur est entrain de remplir le formulaire
        // alors  timer vas diffiser un observable de 800 milli secondes

        debounce(() => this.isFomSubmitted ? timer(0) : timer(800)),
      )
      .subscribe(() => {
        this.formErrors = this.globalGenericValidator.createErrorMessage(this.hotelForm, this.isFomSubmitted);
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
    this.isFomSubmitted = true;
    this.hotelForm.updateValueAndValidity({
      onlySelf: true, // ==> pour mettre à jour le crontrols : tester la valeur de chaque input
      emitEvent: true// ==> pour provoque  et emettre l'evenenment du changement de statut et du
      // changement de valeur de chaque input afin que le validator puisse entrer
      // en jeux  dans le cas d'un submit avec un formulaire vide .
    })
    if (this.hotelForm.valid) { // si mon formulaire est valid
      if (this.hotelForm.dirty) { //si au min il y a un element dans mon formulaire
        const hotel: IHotel = { // remplacer les valeur qui sont dans notre formulaire dans l'objet hotel créé deja dans la fonction displayHotel
          ...this.hotel,
          ...this.hotelForm.value
        };
        if (hotel.id === 0) { // tester si on est entrain de créer un nouveau hotel ou mettre à jour un hotel existant
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
      } else {
        this.saveCompleted();
      }
    } else {
      this.errorMessage = 'Corrigez les erreus s\'il vous plait';
      console.log('isFomSubmitted', this.isFomSubmitted);

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
