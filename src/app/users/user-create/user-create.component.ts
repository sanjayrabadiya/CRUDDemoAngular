import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  imageURL: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({      
      name: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      gender:[''],
      birthDate:['', Validators.required],
      age:[''],
      language:['', Validators.required],
      address:['', Validators.required],
      avatar: ['', Validators.required],
    });
  }
  ngOnInit() {
  }
  removeAvatar(){
    this.imageURL = "";
    this.userForm.patchValue({
      avatar: [''],
    });
  }
  avatarImage(event: any) {    
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
  createUser() { 
    this.createUserOnServer();
    this.router.navigate(['users']);
  }
  cancelUser(){
    this.router.navigate(['users']);
  }
  /* age calculte */
  private calculateAge(birthDate: string): number {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }  
    return age;
  }
  private createUserOnServer() {
    if (this.userForm && this.userForm.valid) {
      const birthDate = this.userForm.get('birthDate')?.value;
      const age = this.calculateAge(birthDate);
      this.userForm.patchValue({ age });
      this.userService.createUser(this.userForm.value).subscribe(
        () => {
          this.toastr.success('User created successfully!');
          this.userForm.reset();
        },
        (error) => {
          this.toastr.error('Error creating user:', error);
        }
      );
    }
  } 
  
}