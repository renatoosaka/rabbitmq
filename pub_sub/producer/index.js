var amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(errCon, connection) {
  if (errCon) {
    throw errCon
  }

  connection.createChannel(function(errChan, channel) { 
    if (errChan) {
      throw errChan
    }

    var exchange = 'logs'
    var msg = process.argv.slice(2).join(' ') || 'Hello World!'

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    channel.publish(exchange, '', Buffer.from(msg))

    console.log('[x] Sent %s', msg)
  })

  setTimeout(function() {
    connection.close()
    process.exit(0)
  }, 500)
})

