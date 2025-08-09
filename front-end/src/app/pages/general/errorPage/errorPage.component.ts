import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-page',
  templateUrl: './errorPage.component.html'
})
export class ErrorPageComponent implements OnInit {
  errorType: number = 404;
  title: string = 'Page Not Found';
  description: string = "Oops! The page you were looking for doesn't exist.";
  returnUrl: string = '/pages/home'; 
  showPreloader: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['type']) {
        this.errorType = data['type'];
        this.title = data['title'] || this.title;
        this.description = data['desc'] || this.description;
      }
    });

    this.route.params.subscribe(params => {
      if (params['type']) {
        this.errorType = +params['type'];
        this.title = this.getErrorTitle(this.errorType);
        this.description = this.getErrorDescription(this.errorType);
      }
    });

    const currentUrl = this.router.url;
    const previousUrl = this.location.path(); 
    if (previousUrl.includes('/admin') || currentUrl.includes('/admin')) {
      this.returnUrl = '/admin/dashboard';
    } else {
      this.returnUrl = '/pages/home';
    }

    setTimeout(() => {
      this.showPreloader = false;
    }, 1000); 
  }

  private getErrorTitle(type: number): string {
    switch (type) {
      case 403:
        return 'Access Denied';
      case 500:
        return 'Server Error';
      default:
        return 'Page Not Found';
    }
  }

  private getErrorDescription(type: number): string {
    switch (type) {
      case 403:
        return 'You do not have permission to access this page.';
      case 500:
        return 'Something went wrong on our end. Please try again later.';
      default:
        return "Oops! The page you were looking for doesn't exist.";
    }
  }
}