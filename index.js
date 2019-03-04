var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
require("dotenv").config();

let userNum = 0;
const port = process.env.PORT || 3000;

http.listen(port, () => console.log(`Listening on http://localhost:${port}`));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  userNum++;
  // io.emit("get user number", { userNum });
  console.log("a user connected", userNum);
  socket.on("new user", data => {
    console.log(data);
    socket.username = data;

    io.emit("get user number", { userNum });

    io.emit("get new message", {
      type: "noti",
      name: socket.username,
      message: "님이 모닥불 주위로 다가왔습니다."
    });
  });
  socket.on("post message", data => {
    console.log(data);
    const { message, id } = data;
    socket.broadcast.emit("get new message", {
      type: "chat",
      name: socket.username + ": ",
      message
    });
    // socket.emit("get_new_message", "can you hear me?", 1, 2, "abc");
    io.to(`${id}`).emit("get new message", {
      type: "yours",
      name: "당신: ",
      message
    });
  });
  socket.on("disconnect", reason => {
    console.log(reason);
    userNum--;
    io.emit("get new message", {
      type: "noti",
      name: socket.username,
      message: "님이 모닥불을 떠났습니다."
    });
    io.emit("get user number", { userNum });
  });
});
