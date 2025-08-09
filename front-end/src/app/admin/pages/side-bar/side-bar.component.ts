import { Component, OnInit } from '@angular/core';
import {  MENU } from '../../menu';
import * as Flowbite from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html'
})
export class SideBarComponent implements OnInit {
  
  constructor(private router: Router) { }
  menuItems:any;
  
  ngOnInit() {
   // this.loadFlowbite();
   this.menuItems = MENU; 

  }

  loadFlowbite(): void {
    if (typeof Flowbite !== 'undefined') {
      const dropdownMenu = document.getElementById('dropdown-user');
      
      if (dropdownMenu) {
        dropdownMenu.addEventListener('click', () => {
          dropdownMenu.classList.toggle('hidden');
        });
      }
    }
  }

  isDropdownOpen = false; // Track dropdown state

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
 
}
