import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserAddEditComponent } from './users/user-add-edit/user-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbToastModule  } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { SelectLanguageComponent } from './language/select-language.component';
import { OrderByPipe } from './order-by.pipe';
import { DisableFutureDatesDirective } from './directive/disable-future-dates.directive';


@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserAddEditComponent,
    SelectLanguageComponent,
    OrderByPipe,
    DisableFutureDatesDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbToastModule,
    NgxPaginationModule,
    
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
