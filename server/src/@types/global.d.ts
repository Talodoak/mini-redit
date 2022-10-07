import { Connection } from 'typeorm';

declare global {
  var redis: {
    get: (key: string) => Promise<string>;
    set: (
      key: string,
      value: any,
      options?: {
        EX: number;
      },
    ) => Promise<string>;
    SELECT: (db: number) => Promise<void>;
    del: (key: string) => Promise<number>;
  };
  var pq: Connection;
}
