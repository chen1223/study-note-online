import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGraduationCap,
         faSearch,
         faPen,
         faAngleLeft,
         faPlus,
         faUndo,
         faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { ShareModule } from './share/share.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    CoreModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    [faGraduationCap,
     faSearch,
     faPen,
     faFacebookSquare,
     faAngleLeft,
     faPlus,
     faUndo,
     faTimes].forEach(icon => {
      library.add(icon);
    });
  }
}
