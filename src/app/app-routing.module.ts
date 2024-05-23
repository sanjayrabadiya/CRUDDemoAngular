import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddEditComponent } from './users/user-add-edit/user-add-edit.component';


const routes: Routes = [  
  { path: 'users', component: UserListComponent },  
  { path: 'users/add', component: UserAddEditComponent },  
  { path: 'users/edit/:id', component: UserAddEditComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
