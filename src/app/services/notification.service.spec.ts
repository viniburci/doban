import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should start with empty notifications', () => {
    expect(service.notifications()).toEqual([]);
  });

  it('should add a notification with show()', () => {
    service.show('Test message', 'info', 0);

    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Test message');
    expect(service.notifications()[0].type).toBe('info');
  });

  it('should generate unique ids for each notification', () => {
    service.show('First', 'info', 0);
    service.show('Second', 'info', 0);

    const [first, second] = service.notifications();
    expect(first.id).not.toBe(second.id);
  });

  it('should add a success notification', () => {
    service.success('Operacao realizada!');

    expect(service.notifications()[0].type).toBe('success');
    expect(service.notifications()[0].message).toBe('Operacao realizada!');
  });

  it('should add an error notification', () => {
    service.error('Algo deu errado.');

    expect(service.notifications()[0].type).toBe('error');
  });

  it('should add a warning notification', () => {
    service.warning('Atencao!');

    expect(service.notifications()[0].type).toBe('warning');
  });

  it('should dismiss a notification by id', () => {
    service.show('Test', 'info', 0);
    service.show('Test 2', 'info', 0);
    const id = service.notifications()[0].id;

    service.dismiss(id);

    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Test 2');
  });

  it('should do nothing when dismissing a non-existent id', () => {
    service.show('Test', 'info', 0);

    service.dismiss('id-inexistente');

    expect(service.notifications().length).toBe(1);
  });

  it('should auto-dismiss after the specified duration', fakeAsync(() => {
    service.show('Auto dismiss', 'info', 1000);
    expect(service.notifications().length).toBe(1);

    tick(1000);

    expect(service.notifications().length).toBe(0);
  }));

  it('should not auto-dismiss when duration is 0', fakeAsync(() => {
    service.show('Persistent', 'info', 0);

    tick(60000);

    expect(service.notifications().length).toBe(1);
  }));

  it('error notifications should auto-dismiss after 6 seconds', fakeAsync(() => {
    service.error('Erro grave');
    expect(service.notifications().length).toBe(1);

    tick(5999);
    expect(service.notifications().length).toBe(1);

    tick(1);
    expect(service.notifications().length).toBe(0);
  }));
});
