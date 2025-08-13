const app = require("../app");
const http = require("http");
const port = normalizedPort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
function normalizedPort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
