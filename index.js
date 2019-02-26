var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const PORT = 3001;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("post_message", data => {
    console.log(data);
    const { name, message } = data;
    io.emit("get_new_message", { name, message });
  });
});

http.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
