var amqp = require('amqplib/callback_api')

var args = process.argv.slice(2)

if (args.length === 0) {
  console.log("Usage: index.js num");
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

    channel.assertQueue('', {
      exclusive: true
    }, function(errQueue, q) {
      if (errQueue) {
        throw errQueue
      }

      var correlationId = generateUUID()
      var num = parseInt(args[0])

      console.log(' [x] Requesting fib(%d)', num);

      channel.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == correlationId) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        }
      }, {
        noAck: true
      });

      channel.sendToQueue('rpc_queue',
        Buffer.from(num.toString()),{
          correlationId: correlationId,
          replyTo: q.queue 
      });
    })
  })
})

function generateUUID() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}