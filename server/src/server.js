import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDB();
  app.listen(env.port, function () {
    console.log("Server running on port " + env.port);
    console.log("Swagger docs: http://localhost:" + env.port + "/api-docs");
  });
}

if (!process.env.VERCEL) {
  startServer();
} else {
  await connectDB();
}

export default app;
