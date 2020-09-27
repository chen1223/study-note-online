import { MessageService } from './../message.service';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageQueueComponent } from './message-queue.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('MessageQueueComponent', () => {
  let component: MessageQueueComponent;
  let fixture: ComponentFixture<MessageQueueComponent>;
  let messageService: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageQueueComponent ],
      imports: [
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MessageService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageQueueComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should have message queue container on the HTML', () => {
    const el = fixture.debugElement.query(By.css('.msg-queue-container'));
    expect(el).toBeTruthy();
  });


  it('should display correct number of message on the HTML', () => {
    messageService.msgQueue = [];
    const msg1 = { type: 'success', msg: 'Save successfully!' };
    const msg2 = { type: 'info', msg: 'Record does not exist' };
    messageService.msgQueue.push(msg1);
    messageService.msgQueue.push(msg2);
    fixture.detectChanges();

    const msgs = fixture.debugElement.queryAll(By.css('.msg'));
    expect(msgs.length).toEqual(messageService.msgQueue.length);
    msgs.forEach((msg, index) => {
      const msgData = messageService.msgQueue[index];
      expect(msg.nativeElement.classList).toContain(`--${msgData.type}`);
      expect(msg.query(By.css('.text')).nativeElement.innerText).toEqual(msgData.msg);
    });
  });

  it('should have close button if message type is warning', () => {
    messageService.msgQueue = [];
    messageService.msgQueue.push({ type: 'warning', msg: '123' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.msg'));
    expect(msg.nativeElement.classList).toContain('--warning');
    expect(msg.query(By.css('.close-btn'))).toBeTruthy();
  });

  it('should have close button if message type is error', () => {
    messageService.msgQueue = [];
    messageService.msgQueue.push({ type: 'error', msg: '123' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.msg'));
    expect(msg.nativeElement.classList).toContain('--error');
    expect(msg.query(By.css('.close-btn'))).toBeTruthy();
  });

  it('should not have close button if message type is success', () => {
    messageService.msgQueue = [];
    messageService.msgQueue.push({ type: 'success', msg: '123' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.msg'));
    expect(msg.nativeElement.classList).toContain('--success');
    expect(msg.query(By.css('.close-btn'))).toBeFalsy();
  });

  it('should not have close button if message type is info', () => {
    messageService.msgQueue = [];
    messageService.msgQueue.push({ type: 'info', msg: '123' });
    fixture.detectChanges();

    const msg = fixture.debugElement.query(By.css('.msg'));
    expect(msg.nativeElement.classList).toContain('--info');
    expect(msg.query(By.css('.close-btn'))).toBeFalsy();
  });
});
