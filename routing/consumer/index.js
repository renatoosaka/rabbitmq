var amqp = require('amqplib/callback_api')

var args = process.argv.slice(2)

if (args.length === 0) {
  console.log("Usage: index.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(errCon, connection) {
  if (errCon) {
    throw errCon
  }

  connection.createChannel(function(errChan, channel) {
    if (errChan) {
      throw errChan
    }

    var exchange = 'direct_logs';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    })

    channel.assertQueue('', {
      exclusive: true,
    }, function(errQueue, q) {
      if (errQueue) {
        throw errQueue
      }
      
      console.log('[*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });
      
      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());        
      }, {
          noAck: true
      })      
    })
  })
})