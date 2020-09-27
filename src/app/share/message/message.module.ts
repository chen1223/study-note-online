import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageQueueComponent } from './message-queue/message-queue.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    MessageQueueComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    MessageQueueComponent
  ]
})
export class MessageModule { }
