import {Injectable} from "@angular/core";

@Injectable()
export class LoggingService {
  lastLog: string = 'Eager or lazy ?';

  printLog(message: string) {
    console.log(message)
    console.log(this.lastLog);
    this.lastLog = message;
  }
}
