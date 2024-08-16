import "dotenv/config";
import connectDB from "./database/config.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
    app.on("errror", (error) => {
      console.log("ERRR: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
