var amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(errCon, connection) {
  if (errCon) {
    throw errCon
  }

  connection.createChannel(function(errChan, channel) {
    if (errChan) {
      throw errChan
    }

    var queue = 'hello'

    channel.assertQueue(queue, {
      durable: false
    })

    console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue)

    channel.consume(queue, function(msg) {
        console.log("[x] Received %s", msg.content.toString());
      }, {
        noAck: true
      }
    )
  })
})