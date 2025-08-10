import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthServiceService } from '../../pages/auth/auth-services/auth-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedStatusSubscription!: Subscription;
  constructor(private authService: AuthServiceService,
    private toastr: ToastrService,
    private router: Router,
  ) { } 
  ngOnDestroy(): void {
    if (this.loggedStatusSubscription) {
      this.loggedStatusSubscription.unsubscribe();
    }
  }

  companyName?: string = '';
  isLoggedIn = true;
  company: { logoPath?: string , companyNameEnglish?:string } | null = null;
  ngOnInit() {
    this.loggedStatusSubscription = this.authService.getloggedStatus().subscribe(status => {
      this.isLoggedIn = status;
      console.log("status", status);
    });

    // const username = this.authService.getUsernameFromToken();
    // this.companyName = username ? username.toUpperCase() : 'Guest';
    // console.log("companyName", this.companyName)

    this.authService.getCompanyDetails().subscribe({
      next: response => {
        if (response.succeeded) {
          this.company = response.data;
          console.log("company",this.company)
        }
      },
      error: err => {
        console.error('Failed to load company details', err);
        // this.router.navigate(['auth/login']);
      }
    });
  }

  //---------------------Toggle----------------------

  isCollapsed = true;
  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isDrawerOpen = false;
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }


  //-------------------- social icons loops-------------------
  socialLinks = [
    { href: '#', icon: 'fa-facebook', aria: 'Facebook' },
    { href: '#', icon: 'fa-twitter', aria: 'Twitter' },
    { href: '#', icon: 'fa-google-plus', aria: 'Google Plus' },
    { href: '#', icon: 'fa-instagram', aria: 'Instagram' },
    { href: '#', icon: 'fa-pinterest-p', aria: 'Pinterest' },
  ];

  menuItems = [
    { href: '/pages/home', label: 'Home' },
    { href: '/pages/about-us', label: 'About' },
    { href: '/pages/contact', label: 'Contact' }
  ];

}
