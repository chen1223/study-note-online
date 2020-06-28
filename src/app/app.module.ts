import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGraduationCap,
         faSearch,
         faPen } from '@fortawesome/free-solid-svg-icons';
import { ShareModule } from './share/share.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ShareModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    [faGraduationCap,
     faSearch,
     faPen].forEach(icon => {
      library.add(icon);
    });
  }
}
