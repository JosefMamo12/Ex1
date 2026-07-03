/**
 * API routes configuration
 * Combines all route modules into a single router
 */

import { Router } from "express";
import authRoutes from "./auth.routes";
import contentRoutes from "./content.routes";
import schedulingRoutes from "./scheduling.routes";
import analyticsRoutes from "./analytics.routes";

const router = Router();

/**
 * Health check endpoint
 * @route GET /api/health
 */
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Toddler Content Machine API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

/**
 * Mount route modules
 */
router.use("/auth", authRoutes);
router.use("/content", contentRoutes);
router.use("/schedule", schedulingRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
