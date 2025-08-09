import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth/auth-services/auth-service.service';
import { ReloadService } from '../../../shared/service/reload.service';
import { SnakebarService } from '../../../shared/service/SnakebarService.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { EventService } from '../services/event.service';
import { BookingService } from '../services/booking.service';
import { SortService } from '../services/sort.service';
import { FilterPriceService } from '../services/filter-price.service';
import { CreateBookingDTO } from '../../models/Booking ';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-event-listings',
  templateUrl: './event-listings.component.html'
})
export class EventListingsComponent implements OnInit, AfterViewInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  isLoggedIn = false;
  userBookings: any[] = [];
  isLoading = true;
  sortOrder: string = 'asc';
  searchResult: boolean = true;

  constructor(
    private reload: ReloadService,
    private router: Router,
    private authService: AuthServiceService,
    private snakebarService: SnakebarService,
    private bookingService: BookingService,
    private eventService: EventService,
    private sortService: SortService,
    private filterPriceService: FilterPriceService,
    private searchService: SearchService
  ) { }

  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }

  ngOnInit() {
    this.loadData();

    this.sortService.sortTerm$.subscribe(order => {
      this.sortOrder = order;
      console.log('Received sort order:', order);
      this.sortEventsByPrice(order);
    });

    this.sortService.sortTermByTickets$.subscribe(order => {
      this.sortOrder = order;
      console.log('Received sort order for tickets:', order);
      this.sortEventsByTickets(order);
    });

    this.searchService.searchTerm$.subscribe((term) => {
      const query = term.toLowerCase().trim();
      this.search(query);
    });

    this.filterPriceService.priceRange$.subscribe(({ minPrice, maxPrice }) => {
      this.applyPriceFilter(minPrice, maxPrice);
    });

    this.eventService.resetObservable$.subscribe((reset) => {
      if (reset) {
        this.filteredEvents = [...this.events];
        this.searchResult = this.filteredEvents.length > 0;
        this.activeFilters = {}; 
      }
    });

    this.authService.getloggedStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  loadData() {
    this.isLoading = true;

    this.eventService.getAllEvents().pipe(
      switchMap(events => {
        this.events = events;
        this.filteredEvents = [...events];


        console.log('Events loaded:', this.filteredEvents);
        if (this.isLoggedIn) {
          const userId = this.authService.getNameIdentifier();
          return this.bookingService.getBookingItemsForAUser(userId).pipe(
            catchError(err => {
              console.error('Error fetching bookings:', err);
              return of([]);
            })
          );
        } else {
          return of([]);
        }
      })
    ).subscribe({
      next: (bookings) => {
        this.userBookings = bookings;
        const userId = this.authService.getNameIdentifier();

        this.events = this.events.map(event => {
          if (!this.isLoggedIn) {
            return { ...event, isBooked: false };
          }

          const isBooked = this.userBookings.some(booking =>
            booking.eventId === event.id && booking.userId === userId
          );

          return { ...event, isBooked };
        });

        this.filteredEvents = [...this.events]; 
        this.searchResult = this.filteredEvents.length > 0;
        this.isLoading = false;
        console.log('Data loaded:', this.events.length, 'events,', this.userBookings.length, 'bookings');
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.snakebarService.showSnakeBar('Failed to load events. Please try again.');
        this.isLoading = false;
        this.searchResult = false;
      }
    });
  }

  routeToDetails(eventId: number) {
    console.log('Navigating to event-details', eventId);
    this.router.navigate(['/pages/event-details', eventId]);
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
      this.snakebarService.showSnakeBar('You need to be logged in to continue.');
      this.router.navigate(['/auth/login']);
    }
  }

  isEventBooked(eventId: number): boolean {
    return this.userBookings.some(booking => booking.eventId === eventId);
  }

  activeFilters: { [key: string]: any } = {};

  applyAllFilters() {
    this.filteredEvents = [...this.events]; 
    console.log('Initial Events:', this.filteredEvents);
    Object.values(this.activeFilters).forEach((filterFn) => {
      this.filteredEvents = filterFn(this.filteredEvents);
    });
    this.searchResult = this.filteredEvents.length > 0;
    console.log('Filtered Events:', this.filteredEvents);
  }

  search(searchItem: string) {
    if (searchItem) {
      this.activeFilters['search'] = (events: any[]) =>
        events.filter((event) =>
          event.name.toLowerCase().includes(searchItem.toLowerCase()) ||
          event.description.toLowerCase().includes(searchItem.toLowerCase()) ||
          event.category.toLowerCase().includes(searchItem.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchItem.toLowerCase())
        );
      console.log('Search term:', searchItem);
    } else {
      delete this.activeFilters['search'];
    }
    this.applyAllFilters();
  }

  sortEventsByPrice(order: string): void {
    this.activeFilters['sortPrice'] = (events: any[]) =>
      this.sortService.sortByPrice(events, order);
    this.applyAllFilters();
  }

  sortEventsByTickets(order: string): void {
    this.activeFilters['sortTickets'] = (events: any[]) =>
      this.sortService.sortByTickets(events, order);
    this.applyAllFilters();
  }

  applyPriceFilter(minPrice: number | null, maxPrice: number | null) {
    if (minPrice !== null || maxPrice !== null) {
      this.activeFilters['priceFilter'] = (events: any[]) =>
        events.filter((event) => {
          const meetsMinPrice = minPrice === null || event.price >= minPrice;
          const meetsMaxPrice = maxPrice === null || event.price <= maxPrice;
          return meetsMinPrice && meetsMaxPrice;
        });
    } else {
      delete this.activeFilters['priceFilter'];
    }
    this.applyAllFilters();
  }
}