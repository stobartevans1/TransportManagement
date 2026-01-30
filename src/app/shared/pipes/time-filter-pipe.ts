import { Pipe, PipeTransform } from '@angular/core';
import { RideInfo } from '../../core/models/ride/rideinfo.model';

@Pipe({
  name: 'timeBuffer',
  pure: false,
})
export class TimeFilterPipe implements PipeTransform {
  transform(rides: RideInfo[]): RideInfo[] {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return rides.filter((ride) => {
      const [hours, minutes] = ride.time.split(':').map(Number);
      const rideMinutes = hours * 60 + minutes;
      return Math.abs(currentMinutes - rideMinutes) <= 60;
    });
  }
}
