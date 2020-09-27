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
         faAngleRight,
         faPlus,
         faUndo,
         faTimes,
         faTint,
         faThumbsUp as thumbsUp,
         faBookmark as bookmark } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { ShareModule } from './share/share.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './share/services/auth-interceptor.service';
import { MessageModule } from './share/message/message.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    CoreModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    MessageModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    [faGraduationCap,
     faSearch,
     faPen,
     faFacebookSquare,
     faAngleLeft,
     faAngleRight,
     faPlus,
     faUndo,
     faTimes,
     faTint,
     faThumbsUp,
     faBookmark,
     thumbsUp,
     bookmark].forEach(icon => {
      library.add(icon);
    });
  }
}
