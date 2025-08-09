import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReloadService } from '../../../shared/service/reload.service';
import { BookingService } from '../services/booking.service';
import { EventService } from '../services/event.service';
import { CreateBookingDTO } from '../../models/Booking ';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { SnakebarService } from '../../../shared/service/SnakebarService.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  isLoggedIn = false;
  constructor(private reload: ReloadService,
    private route: ActivatedRoute,
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthServiceService,
    private snakebarService: SnakebarService,
    private router: Router) { }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  private routeSub!: Subscription;
  private eventSub!: Subscription
  eventId: number = 0;
  event: any = {};
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.eventId = +params.get('eventId')!;
    console.log("params ", this.eventId);

    // 1. Fetch event data
    this.eventService.getEventById(this.eventId).subscribe(item => {
      this.event = item;

      // 2. After fetching event, check login status
      this.authService.getloggedStatus().subscribe(status => {
        this.isLoggedIn = status;

        if (this.isLoggedIn) {
          const userId = this.authService.getNameIdentifier();
          
          // 3. Fetch user's bookings
          this.bookingService.getBookingItemsForAUser(userId).subscribe(bookings => {
            const isBooked = bookings.some(booking => 
              booking.eventId === this.eventId && booking.userId === userId
            );

            this.event.isBooked = isBooked; // 🔥
          }, error => {
            console.error('Error fetching bookings:', error);
          });
        } else {
          this.event.isBooked = false; // Not logged in => not booked
        }
      });
      
    }, (error) => {
      console.error('Error fetching event:', error);
    });
  });
}


  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
    console.log('event Details Component destroyed');
  }

  bookNow(event: any): void {
    if (this.isLoggedIn) {
      console.log('Booking event:', event);

      const bookingRequest: CreateBookingDTO = {
        eventId: event.id,
        ticketCount: 1,
      };

      this.bookingService.addBooking(bookingRequest).subscribe({
        next: (response) => {
          console.log('Booking successful:', response);
          event.isBooked = true;
          this.router.navigate(['/pages/booking-success']);
          this.snakebarService.showSnakeBar('Booking successful');
        },
        error: (err) => {
          console.error('Booking error:', err);
          this.snakebarService.showSnakeBar('Failed to book event. Please try again.');
        }
      });
    } else {
      console.log('User is not authenticated');
      this.snakebarService.showSnakeBar("You need to be logged in to continue.");
      this.router.navigate(['/auth/login']);
    }
  }

}
