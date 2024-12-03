const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const express = require("express");
const app = express();

//#region init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//#endregion

//#region init db
require("./dbs/init.mongodb");
//#endregion

//#region init routers
app.use("/", require("./routes"));
//#endregion

app.use((req, res, next) => {
  const error = new Error("Error");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const message = error.message || "Interval server error";
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
});

module.exports = app;
