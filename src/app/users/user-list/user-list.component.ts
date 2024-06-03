import { Component, OnInit, inject, TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../data-type';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectLanguageComponent } from 'src/app/language/select-language.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  closeResult = '';

  page: number = 1;
  itemsPerPage: number = 15;
  userForm: FormGroup;
  users: User[] = [];
  inactiveUsers: User[] = [];
  imageURL: string | ArrayBuffer | null = null;  
  fileName: string = "";
  size:number = 0;
  languageList: string[] = ['English','Gujarati','Marathi']; 

  sortBy: string = 'id'; 
  sortDirection: number = 1; 
  newUser: User = {
    avatar: {
      imageUrl: '',
      fileName: '',
      size: 0
    },
    id: 0,
    name: '',
    userName: '',
    email: '',
    phoneNo: '',
    gender: '',
    birthDate: '',
    age: 0,
    language: '',
    address: '',
    active: true,
   
  };
  isNewUserAdded = false;
  filteredList: User[] = [];
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router,
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
  }
  ngOnInit() {   
    this.loadUsers();
    this.getInactiveUsers();
  } 
  // get user list code 
  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.filter(user => user.active === true); 
        this.filteredList = [...this.users];               
      },
      (error) => {
        this.toastr.error('Failed to load users:', error);
      }
    );
  }

  getInactiveUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.inactiveUsers = users.filter(user => !user.active);
      },
      (error) => {
        this.toastr.error('Failed to load inactive users:', error);
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
  }
  // User Delete Code
  deleteUser(userId: number | undefined) {
    if (userId !== undefined) {       
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filteredList = this.filteredList.filter(user => user.id !== userId); 
          this.toastr.success(`User has been deactivated successfully.`);
        }
      );        
    } else {
      console.error('Invalid user ID:', userId);
    } 
    this.loadUsers();  
    this.getInactiveUsers(); 
  }
  // active user Code
  activeUser(userId: number | undefined) {
    if (userId !== undefined) {
      const userToUpdate = this.inactiveUsers.find(user => user.id === userId);      
      if (userToUpdate) {
        userToUpdate.active = !userToUpdate.active;  
        this.userService.updateUser(userId, userToUpdate).subscribe(
          () => {
            const statusMessage = userToUpdate.active ? 'activated' : 'deactivated';
            this.toastr.success(`User has been ${statusMessage} successfully.`);
            forkJoin([this.loadUsers(), this.getInactiveUsers()]).subscribe();
          },
          (error) => {
            this.toastr.error('Failed to update user status:', error);
          }
        );
      } else {
        this.toastr.error('User not found.');
      }
    } else {
      console.error('Invalid user ID:', userId);
    }
    this.loadUsers();  
    this.getInactiveUsers(); 
  }

  // Image Convert to base64Image  
  AddavatarImage(event: any, user: any) {    
    const file: File = event.target.files[0];  
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);  
      reader.onload = () => {
        const base64Image = reader.result as string;
        user.avatar = {
          imageUrl: base64Image,
          fileName: file.name,
          size: file.size
        };
      };
    }
  }
  //download 
  downloadAvatar(user: any) {
    const link = document.createElement('a');
    link.href = user.avatar.imageUrl;
    link.download = user.avatar.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // User Edit Code
  startEdit(user: any) { 
    user.checkEdit = true;    
    user.editAvatar = {
      imageUrl: user.avatar.imageUrl || '../../../assets/images/userdammy.jpg',
      fileName: user.avatar.fileName || 'default.jpg',
      size: user.avatar.size || 0
    }
    user.editName = user.name; 
    user.editUserName = user.userName; 
    user.editEmail = user.email;
    user.editPhoneNo = user.phoneNo;
    user.editGender = user.gender,
    user.editBirthDate = user.birthDate,
    user.editAge = this.calculateAge(user.birthDate);
    user.editLanguage = user.language;
    user.editAddress = user.address;  
    user.editactive = user.active;    
  }
  // User Edit to save Code
  saveEdit(user: any) {    
    const updatedUser = {
      avatar: user.avatar,
      name: user.name, 
      userName: user.userName, 
      email: user.email, 
      phoneNo: user.phoneNo,
      gender: user.gender,
      birthDate: user.birthDate,
      age: this.calculateAge(user.birthDate),
      language: user.language,
      address: user.address,
      active: user.active,
    };  
    this.userService.updateUser(user.id, updatedUser).subscribe(
      (response) => {
        this.toastr.success('User updated successfully');
        user.checkEdit = false;
        this.loadUsers();
        this.router.navigate(['/users']);
      },
      (error) => {
        this.toastr.error('Failed to update users:');
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

  // change image
  removeAvatar(){
    const emptyAvatar = { imageUrl: '', fileName: '', size: 0 };
    this.userForm.patchValue({ avatar: emptyAvatar });
    //this.imageURL = '';
  } 
  // Add row in table
  addRow() {
    const lastUserId = this.users.length > 0 ? this.users[this.users.length - 1].id : 0;
    const newId = (lastUserId ?? 0) + 1;
    this.newUser = {
      avatar: { imageUrl: '', fileName: '', size: 0 },
      id: newId,
      name: '',
      userName: '',
      email: '',
      phoneNo: '',
      gender: '',
      birthDate: '',
      age: 0,
      language: '',
      address: '',
      active: true
    };
    this.isNewUserAdded = true;
  }
  // Save new User row in table
  saveNewUser() {
    debugger;
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
  addUser(){
    this.router.navigate(['users/add'],{ queryParams: { mode: 'add' } });
  }   

  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',fullscreen: true }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}
  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}