import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { UserService } from '../../services/userService.service';
import { ReloadService } from '../../../shared/service/reload.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit , AfterViewInit {

  users: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private userService: UserService ,
              private reload: ReloadService 
  ) {}

  ngAfterViewInit(): void {
    this.reload.initializeLoader();
  }
  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response;
        console.log('Users loaded:', this.users);
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully.');
          this.loadUsers(); 
        },
        error: (err) => console.error('Error deleting user', err)
      });
    }
  }

  updateUser(user: User) {
    const updatedUserData = {
      username: 'NewUsername',
      email: 'newemail@example.com'
    };
    this.userService.updateUser(user.id, updatedUserData).subscribe({
      next: () => {
        alert('User updated successfully.');
        this.loadUsers();
      },
      error: (err) => console.error('Error updating user', err)
    });
  }
}