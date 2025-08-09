import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SortService {

constructor() { }

private sortItems: BehaviorSubject<string> = new BehaviorSubject< string>('');
  sortTerm$ = this.sortItems.asObservable();

  private sortItemsByTickets: BehaviorSubject<string> = new BehaviorSubject< string>('');
  sortTermByTickets$ = this.sortItemsByTickets.asObservable();
  
  setSortOrder(order: string) {
    this.sortItems.next(order);
    console.log("form sort service " ,order )
  }
  sortEventsByTickets(order: string) {
    this.sortItemsByTickets.next(order);
  }

  sortByPrice(event: any[], order: string): any[] {
    if (order === 'asc') {
      return event.sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
      return event.sort((a, b) => b.price - a.price);
    } else {
      return event; 
    }
  }

  sortByTickets(event: any[], order: string): any[] {
    if (order === 'asc') {
      return event.sort((a, b) => a.availableTickets- b.availableTickets);
    } else if (order === 'desc') {
      return event.sort((a, b) => b.availableTickets- a.availableTickets);
    } else {
      return event; 
    }
  }

}
