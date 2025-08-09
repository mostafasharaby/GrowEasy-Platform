import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../pages/general/services/appointment.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { BookingService } from '../../../pages/general/services/booking.service';

@Component({
  selector: 'app-temp-appointment',
  templateUrl: './temp-appointment.component.html'
})
export class TempAppointmentComponent implements OnInit {

 appointments: any[] = [];  
   bookings :any[] = [];  
   constructor( 
    private bookingService: BookingService,
    
    private reload :ReloadService) { }
 
   ngOnInit(): void {
     this.loadBookings(); 
   }
 

   loadBookings(): void {
    this.bookingService.getBookingItems().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        console.log('Bookings loaded:', this.bookings);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

}
