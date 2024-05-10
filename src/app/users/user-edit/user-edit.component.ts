import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../data-type';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  user: User | undefined;
  imageURL: string | ArrayBuffer | null = null;  

  constructor(
    private formBuilder: FormBuilder,
    private routerLink: Router, 
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService) { 
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      const userId = +params['id']; 
      if (!isNaN(userId)) {
        this.userId = userId;
        this.loadUserData();
      } else {
        this.toastr.error('Invalid user ID');
        
      }
    });  
  }
  loadUserData(): void {
    if (this.userId !== null) {
      this.userService.getUserById(this.userId).subscribe(
        (user) => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email
          });
        },
        (error) => {
          this.toastr.error('Failed to load user data', error);
          
        }
      );
    } else {
      this.toastr.error('User ID is null');
    }
  }

  saveUser(): void {
    if (this.userForm.valid && this.userId !== null) {
      const updatedUserData = this.userForm.value;
      this.userService.updateUser(this.userId, updatedUserData).subscribe(
        (response) => {
          this.toastr.success('User updated successfully', response);
        },
        (error) => {
          this.toastr.error('Failed to update user', error);
        }
      );
    } else {
      this.userForm.markAllAsTouched();
      this.toastr.error('Form is invalid or User ID is null');
    }
    this.routerLink.navigate(['users']);
  }
  cancelUser(){
    this.routerLink.navigate(['users']);
  }
  avatarImage(event: any) {  
    const file: File = event.target.files[0];    
    let reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageURL = reader.result as string;
        this.userForm.patchValue({
          avatar: reader.result
        });
      };
    }
  }
}