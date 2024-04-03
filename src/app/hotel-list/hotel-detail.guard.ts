import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const hotelDetailGuard: CanActivateFn = (route, state) => {
  console.log(route);
  const id = +route.url[1].path;
  if (isNaN(id) || id <= 0) {
    alert('hotel est inconnu');
    inject(Router).navigate(['/hotels']).then(r => false);
  }
  return true;
};
