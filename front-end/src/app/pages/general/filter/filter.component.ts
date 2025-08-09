import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { SortService } from '../services/sort.service';
import { FilterPriceService } from '../services/filter-price.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

  constructor(private searchService :SearchService , 
              private sortingService :SortService ,
              private filterPriceService :FilterPriceService ,  
              private eventService :EventService ,
            ) { }

  ngOnInit() {
  }

    
  isDialogOpen = false; 
  isDialogMounted = false; 
  openDialog(): void {
    this.isDialogOpen = true;
    setTimeout(() => {
      this.isDialogMounted = true;
    }, 10); 
  }
  closeDialog(): void {
    this.isDialogMounted = false;
    setTimeout(() => {
      this.isDialogOpen = false;
    }, 150); 
  }
  confirm(): void {
    console.log('Confirmed');
    this.closeDialog();
  }


  applyFilters() {
    this.searchService.setSearchTerm(this.searchItem?.toLowerCase().trim() || '');
    this.filterPriceService.setPriceRange(this.minPrice, this.maxPrice);
  
    switch (this.selectedSortOption) {
      case 'priceAsc':
        this.sortEventsByPrice('asc');
        break;
      case 'priceDesc':
        this.sortEventsByPrice('desc');
        break;
      case 'ticketAsc':
        this.sortEventsByTickets('asc');
        break;
      case 'ticketDesc':
        this.sortEventsByTickets('desc');
        break;
      default:
        console.log('No sorting applied');
    }
  console.log('this.selectedSortOption', this.selectedSortOption);
    console.log('Filters applied:',{
      search: this.searchItem,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortOption: this.selectedSortOption
    });
  }

  
  resetFilters() {
    this.searchItem = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.eventService.resetEvents();
  }

  
  public searchItem !: string;
  search(event: any) {
    const query = this.searchItem.toLowerCase().trim();
    console.log('Searching ',query , this.searchItem);
    this.searchService.setSearchTerm(query);      
  }


  selectedSortOption: string = "";
  sortEventsByPrice(sortOrder: string): void {
    console.log("Sorting order set to:", sortOrder);
    this.sortingService.setSortOrder(sortOrder);
    this.selectedSortOption = `Price: ${sortOrder === 'asc' ? 'low to high' : 'high to low'}`;
    console.log("Sorting order set to:", this.selectedSortOption);
  }


  sortEventsByTickets(sortOrder: string): void {
    console.log("Sorting order set to:", sortOrder);
    this.sortingService.sortEventsByTickets(sortOrder);
    this.selectedSortOption = `Tikets: ${sortOrder === 'asc' ? 'low to high' : 'high to low'}`;
    console.log("Sorting order set to:", this.selectedSortOption);
  }
  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSortOption = (event.target as HTMLSelectElement).value;
  }
  

  
  minPrice: number | null = null;
  maxPrice: number | null = null;
  onPriceChange() {
    this.filterPriceService.setPriceRange(this.minPrice, this.maxPrice);
    console.log('Min Price:', this.minPrice, 'Max Price:', this.maxPrice);
  }


}



