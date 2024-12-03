const app = require("./src/app");

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server run in port:: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server express"));
});
