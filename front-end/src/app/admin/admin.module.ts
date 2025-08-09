import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BoardComponent } from './pages/board/board.component';
import { SideBarComponent } from './pages/side-bar/side-bar.component';
import { TempAppointmentComponent } from './pages/temp-appointment/temp-appointment.component';
import { ChartComponent } from './pages/chart/chart.component';
import { AuthModule } from '../pages/auth/auth.module';
import { GeneralModule } from '../pages/general/general.module';
import { UsersComponent } from './pages/users/users.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';

const routes: Routes = [
  { path: 'dashboard', component: BoardComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'users', component: UsersComponent },
  { path: 'side', component: SideBarComponent },
  { path: 'appointments', component: AppointmentsComponent }

]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    AuthModule,
    GeneralModule
  ],
  declarations: [
    AdminComponent,
    BoardComponent,
    ChartComponent,
    UsersComponent,
    SideBarComponent,
    AppointmentsComponent,
    TempAppointmentComponent

  ],
  exports: [SideBarComponent],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
