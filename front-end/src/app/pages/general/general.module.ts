import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general.component';
import { HomeComponent } from './Home/Home.component';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorPageComponent } from './errorPage/errorPage.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';


const routes: Routes = [

  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: UserProfileComponent },

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
    ErrorPageComponent,
    DeleteModalComponent,
  ],
  exports: [DeleteModalComponent]
})
export class GeneralModule { }
