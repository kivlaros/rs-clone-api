import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';

@Injectable()
export class EventsService {
  private readonly emitter = new EventEmitter();

  constructor() {
    // Inject some Service here and everything about SSE will stop to work.
  }

  subscribe(channel: string) {
    return fromEvent(this.emitter, channel);
  }

  emit(channel: string, data?: object) {
    this.emitter.emit(channel, { data });
  }
}
