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
    var msg = 'Hello World'

    channel.assertQueue(queue, {
      durable: false
    })

    channel.sendToQueue(queue, Buffer.from(msg))

    console.log('[x] Sent %s', msg)
  })

  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
  }, 500);  
})