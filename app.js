const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cron = require("node-cron");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const router = require("./routes")
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/",router)

app.listen(process.env.PORT, () => {
  console.log("Started listening on port", process.env.PORT);

  // Mantain server instance
  let counter = 0;
  cron.schedule('*/14 * * * *', () => {
    counter++
    console.log("Taking sip of coffee number... ", counter);
  });
});
