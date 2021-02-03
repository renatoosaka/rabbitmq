var amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(errCon, connection) {
  if (errCon) {
    throw errCon
  }

  connection.createChannel(function(errChan, channel) {
    if (errChan) {
      throw errChan
    }

    var exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    channel.assertQueue('', {
      exclusive: true,
    }, function(errQueue, q) {
      if (errQueue) {
        throw errQueue
      }
      
      console.log("[*] Waiting for messages in %s. To exit press CTRL+C", q.queue)
      
      channel.bindQueue(q.queue, exchange, '')

      channel.consume(q.queue, function(msg) {
        if (msg.content) {
          console.log("[x] %s", msg.content.toString());
        }          
      }, {
          noAck: true
      })      
    })
  })
})