import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(env.port, () => {
        console.log("Server running on port " + env.port);
        console.log("Swagger docs: http://localhost:" + env.port + "/api-docs");
      });
    })
    .catch((error) => {
      console.error("DB connection failed:", error.message);
      process.exit(1); 
    });
}
export default app;
