import { MessageService } from './../message.service';
import { Component, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
  selector: 'app-message-queue',
  templateUrl: './message-queue.component.html',
  styleUrls: ['./message-queue.component.scss'],
  animations: [
    trigger('alertState', [
      transition('void => *', [
        animate('.4s ease-in', keyframes([
          style({
            opacity: '0',
            transform: 'translateX(40px)',
            transition: 'transform top'
          }),
          style({
            opacity: '1',
            transform: 'translateX(0)',
            transition: 'transform top'
          })
        ]))
      ]),
      transition('* => void', [
        animate('.4s ease-out', keyframes([
          style({
            opacity: '1',
            transform: 'translateX(0px)',
            transition: 'transform top'
          }),
          style({
            opacity: '0',
            transform: 'translateX(-40px)',
            transition: 'transform top'
          })
        ]))
      ])
    ])
  ]
})
export class MessageQueueComponent implements OnInit {

  headerHeight = '70px';
  @ViewChildren('msgItems') msgItems: QueryList<ElementRef>;

  constructor(public readonly messageService: MessageService) { }

  ngOnInit(): void {
  }

}


