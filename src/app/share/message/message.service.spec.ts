import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';

fdescribe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should have a variable called msgQueue', () => {
    expect(service.msgQueue).toBeTruthy();
  });

  /**
   * success related tests
   */
  it('should define a function called success', () => {
    expect(service.success).toBeDefined();
  });
  it('should push a success message into queue when success is called', () => {
    service.msgQueue = [];
    const dummyMsg = 'test success message';
    service.success(dummyMsg);
    expect(service.msgQueue.length).toEqual(1);
    const firstMsg = service.msgQueue[0];
    expect(firstMsg.type).toEqual('success');
    expect(firstMsg.msg).toEqual(dummyMsg);
  });

  /**
   * info related tests
   */
  it('should define a function called info', () => {
    expect(service.info).toBeDefined();
  });
  it('should push a info message into queue when info is called', () => {
    service.msgQueue = [];
    const dummyMsg = 'test info message';
    service.info(dummyMsg);
    expect(service.msgQueue.length).toEqual(1);
    const firstMsg = service.msgQueue[0];
    expect(firstMsg.type).toEqual('info');
    expect(firstMsg.msg).toEqual(dummyMsg);
  });

  /**
   * warn related tests
   */
  it('should define a function called warn', () => {
    expect(service.warn).toBeDefined();
  });
  it('should push a warn message into queue when warn is called', () => {
    service.msgQueue = [];
    const dummyMsg = 'test warn message';
    service.warn(dummyMsg);
    expect(service.msgQueue.length).toEqual(1);
    const firstMsg = service.msgQueue[0];
    expect(firstMsg.type).toEqual('warning');
    expect(firstMsg.msg).toEqual(dummyMsg);
  });

  /**
   * error related tests
   */
  it('should define a function called error', () => {
    expect(service.error).toBeDefined();
  });
  it('should push a error message into queue when error is called', () => {
    service.msgQueue = [];
    const dummyMsg = 'test error message';
    service.error(dummyMsg);
    expect(service.msgQueue.length).toEqual(1);
    const firstMsg = service.msgQueue[0];
    expect(firstMsg.type).toEqual('error');
    expect(firstMsg.msg).toEqual(dummyMsg);
  });

  /**
   * clearMessage related tests
   */
  it('should define a function called clearMessage', () => {
    expect(service.clearMessage).toBeDefined();
  });
  it('should remove all messages from queue when clearMessage is called', () => {
    service.msgQueue.push({ type: 'success', msg: '123' });
    service.msgQueue.push({ type: 'info', msg: '234' });
    service.clearMessage();
    expect(service.msgQueue.length).toEqual(0);
  });
});
