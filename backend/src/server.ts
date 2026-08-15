import { app } from "./app.js";

const PORT = process.env.PORT || 5001;

// Start server for local development and non-serverless runtime
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, () => {
    console.log("==========================================");
    console.log(`[SkillSwap] Auth Backend running on port ${PORT}`);
    console.log(`[SkillSwap] Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`[SkillSwap] Health Check: http://localhost:${PORT}/api/health`);
    console.log(`[SkillSwap] Auth Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/auth/logout`);
    console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
    console.log("==========================================");
  });

  // Graceful shutdown handling
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
}

export default app;
