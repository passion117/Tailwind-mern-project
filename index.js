const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const router = require("./routes");
const cors = require("cors");
// const passport = require("passport");
// const cookieSession = require("cookie-session");
// const morgan = require("morgan");
// const path = require("path");

const app = express();

// app.use(morgan("dev"));

mongoose.set("strictQuery", false);

const PORT = process.env.PORT || 3003;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1/buyhomeforless";

// middleware
app.use(express.static(__dirname));
app.use(express.json());
const corsOptions = {
  origin: [process.env.REACT_APP_CLIENT_URL, "http://localhost:3000"],
};
app.use(cors(corsOptions));

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["buyhomeforless"],
//   })
// );

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.use("/", router);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", process.env.REACT_APP_CLIENT_URL], // frontend URI (ReactJS)
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat.users is not define");

      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  });
});
