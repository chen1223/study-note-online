import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/share/message/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.success('Save successfully!');
    this.messageService.info('No record found.');
    this.messageService.warn('Please correct all errors before you continue');
    this.messageService.error('Invalid operation');
    console.log(this.messageService.msgQueue)
    setTimeout(() => {
      this.messageService.msgQueue.splice(0, 1);
    }, 5000);
  }

}
