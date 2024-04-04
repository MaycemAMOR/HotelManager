import {CanDeactivateFn} from '@angular/router';
import {HotelEditComponent} from "../../hotel-edit/hotel-edit.component";

export const hotelEditGuard: CanDeactivateFn<HotelEditComponent> = (
  component) => {
  if (component.hotelForm.dirty) {
    const hotelName = component.hotelForm.get('hotelName')?.value || 'Nouveau hotel';
    return confirm(`Voulez vous annuler les changements effectués sur ${hotelName} ?`);
  }
  return true;
};
