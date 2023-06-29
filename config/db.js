const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = mongoose
      .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/buyhomeforless", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((err) => {
        console.log(err, "err in  connecting");
      });

    mongoose.set("useCreateIndex", true);

    console.log(
      `mongodb successfully connected  ${conn.connection.host}`.magenta.italic
        .underline
    );
  } catch (error) {
    console.log(`error ${error.message}`.red.bold.underline);
    process.exit();
  }
};

module.exports = connectDB;
