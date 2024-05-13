import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../data-type';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectLanguageComponent } from 'src/app/language/select-language.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  page: number = 1;
  itemsPerPage: number = 15;
  userForm: FormGroup;
  users: User[] = [];
  imageURL: string | ArrayBuffer | null = null;  
  fileName: string | null = null;
  languageList: string[] = ['English','Gujarati','Marathi'];

  sortBy: string = 'id'; 
  sortDirection: number = 1; 

  newUser: User = {
    avatar: '',
    id: 0,
    name: '',
    userName: '',
    email: '',
    phoneNo: '',
    gender: '',
    birthDate: '',
    age: 0,
    language: '',
    address: ''
   
  };
  isNewUserAdded = false;
  filteredList: User[] = [];
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({    
      avatar: ['', Validators.required],  
      name: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      gender:[''],
      birthDate:['', Validators.required],
      age:[''],
      language:[this.languageList[0]],
      address:['', Validators.required],
      
    });
  }
  ngOnInit() {   
    this.loadUsers();
  } 
  // get user list code 
  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users; 
        this.filteredList = [...this.users];               
      },
      (error) => {
        this.toastr.error('Failed to load users:', error);
      }
    );
  }
  // Sorting code
  sort(property: string) {
    if (this.sortBy === property) {
      this.sortDirection = -this.sortDirection; 
    } else {
      this.sortBy = property;
      this.sortDirection = 1; 
    }
  }
  filterResults(text: string) {
    if (!text) {
      this.filteredList = this.users;
      return;
    }  
    this.filteredList = this.users.filter( 
      user => 
        user?.name?.toLowerCase().includes(text.toLowerCase()) ||
        user?.userName?.toLowerCase().includes(text.toLowerCase()) ||
        user?.email?.toLowerCase().includes(text.toLowerCase()) ||
        user?.phoneNo?.toLowerCase().includes(text.toLowerCase()) ||
        user?.gender?.toLowerCase().includes(text.toLowerCase()) ||
        user?.birthDate?.toLowerCase().includes(text.toLowerCase()) ||
        user?.language?.toLowerCase().includes(text.toLowerCase()) ||
        user?.address?.toLowerCase().includes(text.toLowerCase())
    );
  }
  // change Language code
  onLanguageChange(user: any) {
    if (user.language === 'Other') {
      this.openAddLanguageModal(user);
    }
  }
  openAddLanguageModal(user: any) {
    const modalRef = this.modalService.open(SelectLanguageComponent, { centered: true });  
    modalRef.result.then((newLanguage: string) => {
      if (newLanguage && !this.languageList.includes(newLanguage)) {
        this.languageList.push(newLanguage);
        user.language = newLanguage;
      }
    }).catch((reason) => {
      console.log('Modal dismissed with reason:', reason);
    });
  }  
  // User Delete Code
  deleteUser(userId: number | undefined) {
    if (userId !== undefined) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filteredList = this.filteredList.filter(user => user.id !== userId);
          this.toastr.success('User deleted successfully:');          
        },
        (error) => {
          this.toastr.error('Error deleting user:', error);
        }
      );
    } else {
      console.error('Invalid user ID:', userId);
    }    
  }
  // User Edit Code
  startEdit(user: any) {  
    user.checkEdit = true;
    user.editAvatar = this.imageURL || user.avatar || '../../../assets/images/userdammy.jpg',
    user.editName = user.name; 
    user.editUserName = user.userName; 
    user.editEmail = user.email;
    user.editPhoneNo = user.phoneNo;
    user.editGender = user.gender,
    user.editBirthDate = user.birthDate,
    user.editAge = this.calculateAge(user.birthDate);
    user.editLanguage = user.language;
    user.editAddress = user.address;        
  }
  // User Edit to save Code
  saveEdit(user: any) {
    const updatedUser = {
      avatar: this.imageURL || user.avatar || '../../../assets/images/userdammy.jpg',
      name: user.name, 
      userName: user.userName, 
      email: user.email, 
      phoneNo: user.phoneNo,
      gender: user.gender,
      birthDate: user.birthDate,
      age: this.calculateAge(user.birthDate),
      language: user.language,
      address: user.address,
    };  
    this.userService.updateUser(user.id, updatedUser).subscribe(
      (response) => {
        this.toastr.success('User updated successfully');
        user.checkEdit = false;
        this.loadUsers();
        this.router.navigate(['/users']);
      },
      (error) => {
        this.toastr.error('Failed to update users:', error);
      }
    );
  }
  // User Edit to cancel Code
  cancelEdit(user: any) {
    user.checkEdit = false; 
  }
  // Age Calaculate by automatic date select code
  calculateAge(user: any): number | undefined {
    if (user.birthDate) {
      const birthDate = new Date(user.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }    
    return undefined;
  } 
  updateUserAge() {
    if (this.newUser.birthDate) {
      this.newUser.age = this.calculateAge(this.newUser.birthDate);
    }
  } 
  // Image Convert to base64Image
  avatarImage(event: any) {      
    const file: File = event.target.files[0];  
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.imageURL = base64Image; 
        this.fileName = file.name;        
        this.userForm.patchValue({
          avatar: reader.result
        });
      };
    }
  }  
  avatarImageTwo(event: any) {    
    const file: File = event.target.files[0];  
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);  
      reader.onload = () => {
        const base64Image = reader.result as string;
        this.imageURL = base64Image;   
        this.fileName = file.name;       
        this.newUser.avatar = base64Image;
      };
    }
  }
  // change image
  removeAvatar(){
    this.imageURL = "";
    this.userForm.patchValue({
      avatar: [''],
    });
  }  
  downloadAvatar(avatar: string) {
    const imageUrl = avatar;
    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(response => {
      const blob = new Blob([response], { type: 'image/*' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'avatar_image.png';
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }
  // Add row in table
  addRow() {
    if (this.users && this.users.length > 0) {
      const lastUserId = this.users[this.users.length - 1].id;
      const newId = lastUserId ? lastUserId + 1 : 1;
      this.newUser = {
        avatar: '',
        id: newId,
        name: '',
        userName: '',
        email: '',
        phoneNo: '',
        gender: '',
        birthDate: '',
        age: 0,
        language: '',
        address: ''
        
      };
    } else {
      this.newUser = {
      avatar: '',
      id: 1,
      name: '',
      userName: '',
      email: '',
      phoneNo: '',
      gender: '',
      birthDate: '',
      age: 0,
      language: '',
      address: ''      
      };
    }
    this.isNewUserAdded = true;
  }
  // Save new User row in table
  saveNewUser() {
    this.updateUserAge();
    if (!this.newUser.name || !this.newUser.userName || !this.newUser.email || !this.newUser.phoneNo || !this.newUser.address || !this.newUser.language || !this.newUser.birthDate || !this.newUser.gender) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    this.userService.createUser(this.newUser).subscribe(
      (response) => {
        this.updateUserAge();
        this.toastr.success('New user added successfully');
        this.isNewUserAdded = false;
        this.newUser = {};
        this.loadUsers();
      },
      (error) => {
        this.toastr.error('Failed to add new user:', error);
      }
    );
  }
  // table row then data not change
  cancelAdd() {
    this.isNewUserAdded = false;
    this.newUser = {};
  }
  // Edit user in other page with route 
  editUser(userId: number) {    
    this.router.navigate(['/users/edit', userId]);
  }
  // Add user in other page with route 
  AddUser(){
    this.router.navigate(['users/add']);
  }   
}