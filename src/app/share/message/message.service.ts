import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  msgQueue: Array<Message> = [];

  constructor() { }

  getMsgs(): Array<Message> {
    return this.msgQueue;
  }

  // Show a successful message
  success(msg: string): void {
    this.msgQueue.push({ type: 'success', msg });
  }

  // Show an info message
  info(msg: string): void {
    this.msgQueue.push({ type: 'info', msg });
  }

  // Show a warning message
  warn(msg: string): void {
    this.msgQueue.push({ type: 'warning', msg });
  }

  // Show a error message
  error(msg: string): void {
    this.msgQueue.push({ type: 'error', msg });
  }

  // Clear all message
  clearMessage(): void {
    this.msgQueue = [];
  }
}
export interface Message {
  type: string;  // Type of the message: 'success', 'info', 'warning', 'error'
  msg: string; // Actual message displayed to user
}
