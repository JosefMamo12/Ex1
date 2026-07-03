/**
 * Toddler Content Machine - Backend API Server
 * 
 * An AI-powered content generation platform for creating
 * engaging video content for toddlers (0-6 years old)
 */

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env, isProduction } from "./config/environment";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { logger } from "./utils/logger";
import { schedulingService } from "./services/scheduling.service";
import routes from "./routes";

/**
 * Initialize and configure the Express application
 * @returns Configured Express application
 */
function createApp(): Express {
  const app = express();
  
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: isProduction,
    crossOriginEmbedderPolicy: isProduction,
  }));
  
  // CORS configuration
  app.use(cors({
    origin: isProduction 
      ? ["https://yourdomain.com"] 
      : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      error: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
  
  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  
  // Request logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.http(`${req.method} ${req.path}`);
    next();
  });
  
  // API routes
  app.use("/api", routes);
  
  // Root endpoint
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Toddler Content Machine API",
      description: "AI-powered video content generation for toddlers (0-6 years)",
      version: "1.0.0",
      documentation: "/api/health",
      features: [
        "AI video content generation",
        "Optimal upload timing recommendations",
        "Multi-platform scheduling (YouTube, TikTok)",
        "Performance analytics and monetization tracking",
        "Content templates for various categories",
      ],
    });
  });
  
  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: "Endpoint not found",
    });
  });
  
  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
    
    res.status(500).json({
      success: false,
      error: isProduction ? "Internal server error" : err.message,
    });
  });
  
  return app;
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();
    
    // Initialize scheduling service
    await schedulingService.initialize();
    
    // Create and start Express app
    const app = createApp();
    
    const server = app.listen(env.PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🎬 Toddler Content Machine API Server                       ║
║                                                               ║
║   Server running on port ${env.PORT}                              ║
║   Environment: ${env.NODE_ENV.padEnd(44)}║
║                                                               ║
║   API Endpoints:                                              ║
║   • Health Check:    GET  /api/health                         ║
║   • Authentication:  POST /api/auth/register                  ║
║   • Content:         POST /api/content/generate               ║
║   • Scheduling:      GET  /api/schedule/optimal-times         ║
║   • Analytics:       GET  /api/analytics/summary              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
      `);
    });
    
    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, shutting down gracefully...`);
      
      server.close(async () => {
        logger.info("HTTP server closed");
        await disconnectDatabase();
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };
    
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
startServer();
