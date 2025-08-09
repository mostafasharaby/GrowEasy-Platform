import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MENU } from '../../menu';
import { ToastrService } from 'ngx-toastr';
import { Doctor } from '../../../pages/models/doctor';
import { ReloadService } from '../../../shared/service/reload.service';
import { TotalEarningsService } from '../../services/total-earnings.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { EventService } from '../../../pages/general/services/event.service';
import { BookingService } from '../../../pages/general/services/booking.service';
import { UserService } from '../../services/userService.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  appointments: any[] = [];
  infoBoxes: any[] = [];
  numOfEvents: number = 0;
  numOfUsers: number = 0;
  numOfBookings: number = 0;
  totalAmountEarning: number = 0;
  selectedAppointmentId!: number;
  menuItems = MENU;
  events: any[] = [];
  bookings: any[] = [];
  users: any[] = [];
  private subscriptions: Subscription[] = [];  

  constructor(
    private reload: ReloadService,
    private toaster: ToastrService,
    private totalEarningService: TotalEarningsService,
    private eventService: EventService,
    private bookingService: BookingService,
    private userService: UserService
  ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log("BoardComponent destroyed and subscriptions cleaned up.");
  }
  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }

  ngOnInit(): void {
    this.optimizeWidget();
    this.getTotalEarning();
    this.loadEvents();
    this.loadBookings();
    this.loadUsers();
  }

  loadBookings(): void {
    this.bookingService.getBookingItems().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.numOfBookings = this.bookings.length;
        this.optimizeWidget();
        console.log('Bookings loaded:', this.bookings, this.numOfBookings);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
      }
    });
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.numOfEvents = this.events.length;
        this.optimizeWidget();
        console.log('Events:', this.events, this.numOfEvents);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  loadUsers() {
    this.userService.getUsers(1, 10).subscribe({
      next: (response) => {
        this.users = response;
        this.numOfUsers = this.users.length;
        this.optimizeWidget();
        console.log('Users loaded:', this.users, this.numOfUsers);
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  getTotalEarning(): void {
    const earningSub = this.totalEarningService.getTotalEarnings().subscribe({
      next: (data) => {
        this.totalAmountEarning = data;
        console.log('Total Earnings:', this.totalAmountEarning);
      },
      error: (err) => {
        console.error('Error fetching total earnings:', err);
      }
    });
    this.subscriptions.push(earningSub);
  }

  optimizeWidget(): void {
    this.infoBoxes = [
      {
        bgClass: 'bg-blue',
        iconClass: 'fas fa-users',
        text: 'Events',
        number: this.numOfEvents,
        progress: 45,
        description: '45% Increase in 28 Days',
      },
      {
        bgClass: 'bg-orange',
        iconClass: 'fas fa-user',
        text: 'New Users',
        number: this.numOfUsers,
        progress: 40,
        description: '40% Increase in 28 Days',
      },
      {
        bgClass: 'bg-purple',
        iconClass: 'fas fa-syringe',
        text: 'Bookings',
        number: this.numOfBookings,
        progress: 85,
        description: '85% Increase in 28 Days',
      },
      {
        bgClass: 'bg-success',
        iconClass: 'fas fa-dollar-sign',
        text: 'Earning',
        number: this.totalAmountEarning + "$",
        progress: 50,
        description: '50% Increase in 28 Days',
      },
    ];
  }

  openDeleteModal(id: number) {
    this.selectedAppointmentId = id;
    //console.log("Selected appointment ID:", this.selectedAppointmentId);
    this.deleteModal.showModal();
  }

  @ViewChild(DeleteModalComponent) deleteModal!: DeleteModalComponent;
  onDeleteEvent(id: number) {
    console.log("Deleting appointment with ID:", id);
    const deleteSub = this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.toaster.success("Appointment deleted successfully");
        this.loadEvents();
      },
      error: (err) => {
        console.error('Error deleting appointment:', err);
        this.toaster.error("Error deleting appointment");
      }
    });
    this.subscriptions.push(deleteSub);
  }


  @ViewChild('editModal', { static: false }) editModal!: ElementRef;

  eventId: number = 0;
  name: string = '';
  description: string = '';
  category: string = '';
  eventDate: string = '';
  venue: string = '';
  price: number = 0;
  availableTickets: number = 0;
  imageFile: File | null = null;
  removeCurrentImage: boolean = false;

  onEditEvent(event: any): void {
    this.eventId = event.id;
    this.name = event.name;
    this.description = event.description;
    this.category = event.category;
    this.eventDate = event.eventDate.split('T')[0];
    this.venue = event.venue;
    this.price = event.price;
    this.availableTickets = event.availableTickets;
    this.removeCurrentImage = false; 
    const modalElement = this.editModal.nativeElement;
    modalElement.classList.remove('hidden');
  }

  closeModal(): void {
    const modalElement = this.editModal.nativeElement;
    modalElement.classList.add('hidden');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  saveEvent(): void {
    if (!this.eventId) {
      this.toaster.error("No event selected!");
      return;
    }

    const formData = new FormData();
    formData.append('Id', this.eventId.toString());
    formData.append('Name', this.name);
    formData.append('Description', this.description);
    formData.append('Category', this.category);
    formData.append('EventDate', this.eventDate);
    formData.append('Venue', this.venue);
    formData.append('Price', this.price.toString());
    formData.append('AvailableTickets', this.availableTickets.toString());
    formData.append('RemoveCurrentImage', this.removeCurrentImage.toString());

    if (this.imageFile) {
      formData.append('Image', this.imageFile);
    }

    const editSub = this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.toaster.success("Event updated successfully");
        this.loadEvents();
      },
      error: (err) => {
        console.error('Error updating event:', err);
        this.toaster.error("Error updating event");
      }
    });

    this.subscriptions.push(editSub);
    this.closeModal();
  }

  @ViewChild('addModal', { static: false }) addModal!: ElementRef;
  addName: string = '';
  addDescription: string = '';
  addCategory: string = '';
  addEventDate: string = '';
  addVenue: string = '';
  addPrice: number = 0;
  addAvailableTickets: number = 0;
  addImageFile: File | null = null;

  openAddEventModal(): void {
    const modalElement = this.addModal.nativeElement;
    modalElement.classList.remove('hidden');
  }

  closeAddModal(): void {
    const modalElement = this.addModal.nativeElement;
    modalElement.classList.add('hidden');
  }

  onAddFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addImageFile = file;
    }
  }

  saveNewEvent(): void {
    const formAddData = new FormData();
    formAddData.append('Name', this.addName);
    formAddData.append('Description', this.addDescription);
    formAddData.append('Category', this.addCategory);
    formAddData.append('EventDate', this.addEventDate);
    formAddData.append('Venue', this.addVenue);
    formAddData.append('Price', this.addPrice.toString());
    formAddData.append('AvailableTickets', this.addAvailableTickets.toString());



    if (this.addImageFile) {
      formAddData.append('image', this.addImageFile);
    }
    for (const pair of (formAddData as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const addSub = this.eventService.addEvent(formAddData).subscribe({
      next: () => {
        this.toaster.success("Event added successfully");
        this.loadEvents(); 
      },
      error: (err) => {
        console.error('Error adding event:', err);
        this.toaster.error("Error adding event");
      }
    });

    this.subscriptions.push(addSub);
    this.closeAddModal();
  }

}
