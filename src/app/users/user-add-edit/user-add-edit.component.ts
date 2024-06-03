import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../data-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectLanguageComponent } from 'src/app/language/select-language.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.scss']
})
export class UserAddEditComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  user: User = {};
  imageURL: string | ArrayBuffer | null = null; 
  fileName: string = "";
  size:number = 0;
  languageList: string[] = ['English','Gujarati','Marathi'];  
  isEditMode = false;
  isFormChanged = false;

  constructor(
    private fb: FormBuilder, 
    private routerLink: Router, 
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { 
    this.userForm = this.fb.group({
      avatar: this.fb.group({
        imageUrl: [''],
        fileName: [''],
        size: [0]
      }),  
      name: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      gender:[''],
      birthDate:['', Validators.required],
      age:[''],
      language:[this.languageList[0]],
      address:['', Validators.required],
      active: [true] 
    });
    // Subscribe to form value changes
    this.userForm.valueChanges.subscribe(() => {
      this.isFormChanged = true;
    });
  }

  ngOnInit(): void { 
    this.route.queryParams.subscribe(params => {
      this.isEditMode = params['mode'] !== 'add';
    });
    this.loadUserData(); 
  }
  
  loadUserData() {
    if (this.isEditMode) {
      this.route.params.subscribe(params => {
        const userId = +params['id'];
        if (!isNaN(userId)) {
          this.userId = userId;
          this.userService.getUserById(this.userId).subscribe(
            (user) => {
              this.user = user;
              this.userForm.patchValue(user);
              this.isFormChanged = false;
            },
            (error) => {
              this.toastr.error('Failed to load user data', error);
            }
          );
        } 
      });
    }
    else {
      this.isFormChanged = false;
    }
  }

  saveUser(): void {
    if (this.userForm.valid && this.userId !== null) {
      const updatedUserData = this.userForm.value;
      this.userService.updateUser(this.userId, updatedUserData).subscribe(
        (response) => {
          this.toastr.success('User updated successfully');
          this.router.navigate(['users']);
        },
        (error) => {
          this.toastr.error('Failed to update user', error);
        }
      );
    } else {
      this.userForm.markAllAsTouched();
      this.toastr.error('Form is invalid or User ID is null');
    }
  }
  cancelUser(){
    this.routerLink.navigate(['users']);
  }
  // Image Convert to base64Image  
  addAvatarImage(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result as string;
        const avatar = {
          imageUrl: base64Image,
          fileName: file.name,
          size: file.size
        };
        this.user.avatar = avatar;
        this.userForm.patchValue({ avatar });
      };
    }
  }
  removeAvatar(): void {
    this.user.avatar = { imageUrl: '', fileName: '', size: 0 };
    this.userForm.patchValue({
      avatar: { imageUrl: '', fileName: '', size: 0 }
    });
  }

  createUser() { 
    if (this.userForm.valid) {
      const birthDate = this.userForm.get('birthDate')?.value;
      const age = this.calculateAge(birthDate);
      this.userForm.patchValue({ age });
      this.userService.createUser(this.userForm.value).subscribe(
        () => {
          this.toastr.success('User created successfully!');
          this.userForm.reset();
          this.router.navigate(['users']);
        },
        (error) => {
          this.toastr.error('Error creating user:', error);
        }
      );
    }
    
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
  // change Language code
  onLanguageChange() {
    const languageControl = this.userForm.get('language');
    if (languageControl && languageControl.value === 'Other') {
      this.openAddLanguageModal();
    }
  }
  openAddLanguageModal() {
    const modalRef = this.modalService.open(SelectLanguageComponent, { centered: true });  
    modalRef.result.then((newLanguage: string) => {
      if (newLanguage && !this.languageList.includes(newLanguage)) {
        this.languageList.push(newLanguage);
        const languageControl = this.userForm.get('language');
        if (languageControl) {
          languageControl.setValue(newLanguage); 
        }
      }
    }).catch((reason) => {
      this.toastr.error('Modal dismissed with reason:', reason);
    });
  }  
}