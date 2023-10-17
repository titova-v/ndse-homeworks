const http = require('http');

const COUNTER_URL = process.env.COUNTER_URL || '127.0.0.1';

class Counter {
    setCount(id, cb) {
        const data = JSON.stringify({ bookId: id })
      
        const req = http.request(
          {
            hostname: COUNTER_URL,
            port: 3000,
            path: `/counter/${id}/incr`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }, cb)
          req.on('error', (error) => {
            console.error(error)
        })
        req.write(data);
        req.end();
      }

      getCount(id, cb) {
        const req = http.request(
          {
            hostname: COUNTER_URL,
            port: 3000,
            path: `/counter/${id}`,
            method: 'GET'
          }, cb)
          req.on('error', (error) => {
            console.error(error)
            return error;
          })
          req.end();
      }
}

exports.Counter = new Counter()