const http = require('http');
const debug = require('debug')('node-angular');
const app = require('./backend/app');

const normalizePort = val => {
  var port = parseInt(val, 10);

  // Make sure our port env variable contains a valid number
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Check which type of error occured, log an appropriate message, and exit gracefully
const onError = error => {

  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Simply logging that we are listening to incoming requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

// setting up the port
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// setting up the Node server
const server = http.createServer(app);

// setting up two listeners
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
