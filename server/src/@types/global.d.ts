/* eslint-disable */
import { Connection } from 'typeorm';
import { RedisClientType } from 'redis';

declare global {
  var redis: RedisClientType;
  var pq: Connection;
}
