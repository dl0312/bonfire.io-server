var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
require("dotenv").config();

let userNum = 0;

http.listen(process.env.PORT || 3000, () =>
  console.log(`Listening on http://localhost:${PORT}`)
);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  userNum++;
  // io.emit("get user number", { userNum });
  console.log("a user connected", userNum);
  socket.on("new user", data => {
    console.log(data);
    io.emit("get user number", { userNum });

    io.emit("get new message", {
      name: data,
      message: "님이 모닥불 주위로 다가왔습니다."
    });
  });
  socket.on("post message", data => {
    console.log(data);
    const { name, message, id } = data;
    socket.broadcast.emit("get new message", { name: name + ": ", message });
    // socket.emit("get_new_message", "can you hear me?", 1, 2, "abc");
    io.to(`${id}`).emit("get new message", { name: "당신: ", message });
  });
  socket.on("disconnect", () => {
    userNum--;
    io.emit("get user number", { userNum });
  });
});
