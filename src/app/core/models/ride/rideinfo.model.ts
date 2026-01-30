export interface RideInfo {
  id: number;
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  time: string; // "HH:mm" format
  pickupPoint: string;
  destination: string;
  passengers: string[]; // To track who booked
}