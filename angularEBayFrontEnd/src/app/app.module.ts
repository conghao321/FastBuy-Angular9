import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent} from './inputform/inputform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './card/card.component';
import { TabComponent } from './tab/tab.component';
import { MatSliderModule } from '@angular/material/slider';
import { PageComponent } from './page/page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {NgxPaginationModule} from 'ngx-pagination'; //



@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: FormComponent }
    ]),
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    NgxPaginationModule//pagination
  ],
  declarations: [
    AppComponent,
    FormComponent,
    CardComponent,
    TabComponent,
    PageComponent 
  ],
  bootstrap: [ AppComponent ],
  providers: []
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/