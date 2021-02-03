var amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(errCon, connection) {
  if (errCon) {
    throw errCon
  }

  connection.createChannel(function(errChan, channel) {
    if (errChan) {
      throw errChan
    }

    var queue = 'task_queue'

    channel.assertQueue(queue, {
      durable: true
    })

    channel.prefetch(1)
    
    console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue)

    channel.consume(queue, function(msg) {
        var secs = msg.content.toString().split('.').length - 1

        console.log("[x] Received %s", msg.content.toString());

        setTimeout(function() {
          console.log('[x] Done')
          channel.ack(msg)
        }, secs * 1000)
      }, {
        noAck: false
      }
    )
  })
})