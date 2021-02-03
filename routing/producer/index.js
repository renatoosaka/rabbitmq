var amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(errCon, connection) {
  if (errCon) {
    throw errCon
  }

  connection.createChannel(function(errChan, channel) { 
    if (errChan) {
      throw errChan
    }

    var exchange = 'direct_logs'
    var args = process.argv.slice(2)
    var msg = args.slice(1).join(' ') || 'Hello World!'
    var severity = (args.length > 0) ? args[0] : 'info'

    channel.assertExchange(exchange, 'direct', {
      durable: false
    })

    channel.publish(exchange, severity, Buffer.from(msg))

    console.log('[x] Sent %s: %s', severity, msg)
  })

  setTimeout(function() {
    connection.close()
    process.exit(0)
  }, 500)
})

