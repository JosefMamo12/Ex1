/**
 * Content controller handling content generation, management, and templates
 */

import { Request, Response } from "express";
import { prisma } from "../config/database";
import { contentGenerationService } from "../services/content-generation.service";
import { logger } from "../utils/logger";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import type { ContentGenerationRequest } from "../types";

/**
 * Generate new content using AI
 * @route POST /api/content/generate
 */
export async function generateContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const request: ContentGenerationRequest = {
      templateId: req.body.templateId,
      title: req.body.title,
      category: req.body.category,
      ageRange: req.body.ageRange,
      style: req.body.style,
      duration: req.body.duration,
      customPrompt: req.body.customPrompt,
      generateVoiceover: req.body.generateVoiceover,
      generateThumbnail: req.body.generateThumbnail,
      tags: req.body.tags,
    };
    
    const result = await contentGenerationService.generateContent(userId, request);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: "Content generated successfully",
        data: result,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error ?? "Content generation failed",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Content generation failed";
    logger.error(`Generate content error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get all content for the authenticated user
 * @route GET /api/content
 */
export async function getContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { status, category, page, limit } = req.query;
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const where: Record<string, unknown> = { userId };
    if (status) where.status = status;
    if (category) where.category = category;
    
    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          template: true,
          schedules: {
            orderBy: { scheduledTime: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.content.count({ where }),
    ]);
    
    res.json({
      success: true,
      data: content,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + content.length < total,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get content";
    logger.error(`Get content error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get a single content item by ID
 * @route GET /api/content/:id
 */
export async function getContentById(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    const content = await prisma.content.findFirst({
      where: { id, userId },
      include: {
        template: true,
        schedules: {
          include: {
            platformConnection: {
              select: {
                id: true,
                platform: true,
                channelName: true,
              },
            },
          },
        },
        analytics: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
      },
    });
    
    if (!content) {
      res.status(404).json({
        success: false,
        error: "Content not found",
      });
      return;
    }
    
    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get content";
    logger.error(`Get content by ID error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Update content metadata
 * @route PATCH /api/content/:id
 */
export async function updateContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    // Verify ownership
    const existing = await prisma.content.findFirst({
      where: { id, userId },
    });
    
    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Content not found",
      });
      return;
    }
    
    const content = await prisma.content.update({
      where: { id },
      data: {
        title: req.body.title ?? existing.title,
        description: req.body.description ?? existing.description,
        tags: req.body.tags ?? existing.tags,
        updatedAt: new Date(),
      },
    });
    
    res.json({
      success: true,
      message: "Content updated successfully",
      data: content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update content";
    logger.error(`Update content error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Delete content
 * @route DELETE /api/content/:id
 */
export async function deleteContent(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    const { id } = req.params;
    
    // Verify ownership
    const existing = await prisma.content.findFirst({
      where: { id, userId },
    });
    
    if (!existing) {
      res.status(404).json({
        success: false,
        error: "Content not found",
      });
      return;
    }
    
    await prisma.content.delete({ where: { id } });
    
    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete content";
    logger.error(`Delete content error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get content templates
 * @route GET /api/content/templates
 */
export async function getTemplates(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    
    const templates = await contentGenerationService.getTemplates(
      category as string | undefined
    );
    
    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get templates";
    logger.error(`Get templates error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Create a custom content template
 * @route POST /api/content/templates
 */
export async function createTemplate(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = (req as AuthenticatedRequest).user;
    
    const template = await contentGenerationService.createTemplate(userId, {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      style: req.body.style,
      duration: req.body.duration,
      promptTemplate: req.body.promptTemplate,
      tags: req.body.tags,
      isPublic: req.body.isPublic,
    });
    
    res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create template";
    logger.error(`Create template error: ${message}`);
    
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

/**
 * Get content categories with metadata
 * @route GET /api/content/categories
 */
export async function getCategories(_req: Request, res: Response): Promise<void> {
  const categories = [
    { id: "NURSERY_RHYMES", name: "Nursery Rhymes", description: "Classic and modern nursery rhymes with animations", suggestedDuration: 120 },
    { id: "COUNTING", name: "Counting & Numbers", description: "Learn numbers through fun counting activities", suggestedDuration: 90 },
    { id: "ALPHABET", name: "Alphabet & Letters", description: "ABC learning with engaging visuals", suggestedDuration: 90 },
    { id: "COLORS", name: "Colors", description: "Colorful adventures teaching color recognition", suggestedDuration: 60 },
    { id: "SHAPES", name: "Shapes", description: "Geometric fun with basic shapes", suggestedDuration: 60 },
    { id: "ANIMALS", name: "Animals", description: "Discover animals and their sounds", suggestedDuration: 90 },
    { id: "VEHICLES", name: "Vehicles", description: "Cars, trucks, and things that go", suggestedDuration: 90 },
    { id: "NATURE", name: "Nature", description: "Explore the natural world", suggestedDuration: 90 },
    { id: "BEDTIME", name: "Bedtime & Lullabies", description: "Calming content for sleep time", suggestedDuration: 180 },
    { id: "EDUCATIONAL", name: "General Educational", description: "Various educational topics for toddlers", suggestedDuration: 120 },
    { id: "MUSIC_DANCE", name: "Music & Dance", description: "Interactive music and movement", suggestedDuration: 90 },
    { id: "STORIES", name: "Stories", description: "Short animated stories for toddlers", suggestedDuration: 180 },
  ];
  
  res.json({
    success: true,
    data: categories,
  });
}

/**
 * Get animation styles with metadata
 * @route GET /api/content/styles
 */
export async function getStyles(_req: Request, res: Response): Promise<void> {
  const styles = [
    { id: "CARTOON_2D", name: "2D Cartoon", description: "Classic flat cartoon style with bold colors" },
    { id: "CARTOON_3D", name: "3D Cartoon", description: "Modern 3D animated characters" },
    { id: "CLAY_ANIMATION", name: "Clay Animation", description: "Stop-motion claymation style" },
    { id: "WATERCOLOR", name: "Watercolor", description: "Soft, artistic watercolor illustrations" },
    { id: "PIXEL_ART", name: "Pixel Art", description: "Retro-style pixel graphics" },
    { id: "REALISTIC", name: "Semi-Realistic", description: "More realistic animated style" },
    { id: "MINIMALIST", name: "Minimalist", description: "Simple, clean geometric designs" },
    { id: "COLORFUL_ABSTRACT", name: "Colorful Abstract", description: "Bright, abstract visual patterns" },
  ];
  
  res.json({
    success: true,
    data: styles,
  });
}
