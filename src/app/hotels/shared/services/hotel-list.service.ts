import {Injectable} from "@angular/core";
import {catchError, Observable, of, tap, throwError} from "rxjs";

import {IHotel} from "../models/hotel";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class HotelListService {

  private readonly HOTEL_API_URL = 'api/hotels';

  constructor(private http: HttpClient) {
  }

  public getHotels(): Observable<IHotel[]> {
    const url = `${this.HOTEL_API_URL}`;
    return this.http.get<IHotel[]>(url).pipe(
      tap(hotels => console.log('hotels : ', hotels)),
      catchError(this.handleError)
    );
  }

  public getHotelById(id: number): Observable<IHotel> {
    const url = `${this.HOTEL_API_URL}/${id}`;
    if (id == 0) {
      return of(this.getDefaultHotel());
    }
    // @ts-ignore
    return this.http.get<IHotel>(url).pipe(
      catchError(this.handleError)
    );
  }

  public updateHotel(hotel: IHotel): Observable<IHotel> {
    const url = `${this.HOTEL_API_URL}/${hotel.id}`;
    return this.http.put<IHotel>(url, hotel).pipe(
      catchError(this.handleError)
    );
  }

  public createHotel(hotel: IHotel): Observable<IHotel> {
    hotel = {
      ...hotel,
      imageUrl: 'assets/img/hotel-room.jpg',
      id: null,
    };
    return this.http.post<IHotel>(this.HOTEL_API_URL, hotel).pipe(
      catchError(this.handleError)
    );
  }

  public deleteHotel(id: number): Observable<{}> {
    const url = `${this.HOTEL_API_URL}/${id}`;
    return this.http.delete<IHotel>(url).pipe(
      catchError(this.handleError)
    );
  }

  private getDefaultHotel(): IHotel {
    return {
      id: 0,
      hotelName: '',
      description: '',
      price: 0,
      imageUrl: '',
      rating: 0,
    };
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      errorMessage = `An error occured:  ${error.error}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      errorMessage = `Backend returned code ${error.status}, body was: ` + error.error;
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.' +
      '\n' +
      errorMessage));
  }


  /* public getHotels(): IHotel[] {
    return [
      {
        "hotelId": 1,
        "hotelName": "Buea sweet life",
        "description": "Belle vue au bord de la mer",
        "price": 230.5,
        "imageUrl": "assets/img/hotel-room.jpg",
        "rating": 3.5
      },
      {
        "hotelId": 2,
        "hotelName": "Marakech",
        "description": "Profitez de la vue sur les montagnes",
        "price": 145.5,
        "imageUrl": "assets/img/the-interior.jpg",
        "rating": 5
      },
      {
        "hotelId": 3,
        "hotelName": "Abudja new look palace",
        "description": "Séjour complet avec service de voitures",
        "price": 120.12,
        "imageUrl": "assets/img/indoors.jpg",
        "rating": 4
      },
      {
        "hotelId": 4,
        "hotelName": "Cape town city",
        "description": "Magnifique cadre pour votre séjour",
        "price": 135.12,
        "imageUrl": "assets/img/window.jpg",
        "rating": 2.5
      }
    ];
  }*/


}
