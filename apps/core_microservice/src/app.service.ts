import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const x: string = 'test';
    console.log(x);
    return 'Hello World!';
  }
}
