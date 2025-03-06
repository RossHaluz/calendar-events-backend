const { app } = require("./app");
const { prismadb } = require("./lib/prismaClient");

const { PORT } = process.env;

async function startServer() {
  try {
    await prismadb.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
