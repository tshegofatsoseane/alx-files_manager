import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represent a Redis client.
 */
class RedisClient {
  /**
   * Start a RedisClient instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Checks the client connection to the Redis server is activated.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * Gets the value of a key.
   * @param {String} key - key of the item to get.
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key, it's value and exp time
   * @param {String} key The key of item to store.
   * @param {String | Number | Boolean} value item to store.
   * @param {Number} duration - The expiration time for the item in secs.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes the key value
   * @param {String} key - The key of the item to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
