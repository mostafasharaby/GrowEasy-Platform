import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general.component';
import { HomeComponent } from './Home/Home.component';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
import { DeleteModalComponent } from '../../admin/pages/delete-modal/delete-modal.component';
import { EventListingsComponent } from './event-listings/event-listings.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventPageComponent } from './event-page/event-page.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { FilterComponent } from './filter/filter.component';
import { ErrorPageComponent } from './errorPage/errorPage.component';


const routes: Routes = [

  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'events', component: EventPageComponent },
  { path: 'event-details/:eventId', component: EventDetailsComponent },
  { path: 'booking-success', component: BookingSuccessComponent },

]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    FormsModule 
    
  ],
  declarations: [
    GeneralComponent,
    HomeComponent,
    AboutUsComponent,
    ContactUsComponent,
    UserProfileComponent,
    FaqComponent,
    EventListingsComponent,
    EventPageComponent,
    EventDetailsComponent,
    FilterComponent,
    ErrorPageComponent,
    BookingSuccessComponent,
    DeleteModalComponent,
  ],
  exports: [DeleteModalComponent]
})
export class GeneralModule { }
