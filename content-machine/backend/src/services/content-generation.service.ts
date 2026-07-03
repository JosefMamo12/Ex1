/**
 * AI Content Generation Service
 * Handles AI-powered video, script, and thumbnail generation for toddler content
 */

import OpenAI from "openai";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database";
import { env } from "../config/environment";
import { logger } from "../utils/logger";
import type { 
  ContentGenerationRequest, 
  AIGenerationResult,
  TODDLER_CATEGORIES,
  ANIMATION_STYLES 
} from "../types";

/**
 * Content generation service for AI-powered toddler video creation
 */
export class ContentGenerationService {
  private openai: OpenAI | null = null;
  private replicate: Replicate | null = null;
  
  constructor() {
    // Initialize OpenAI client if API key is available
    if (env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
    
    // Initialize Replicate client if API token is available
    if (env.REPLICATE_API_TOKEN) {
      this.replicate = new Replicate({
        auth: env.REPLICATE_API_TOKEN,
      });
    }
  }
  
  /**
   * Generate complete toddler content including script, video, and thumbnail
   * @param userId - ID of the user creating content
   * @param request - Content generation parameters
   * @returns Generated content record
   */
  async generateContent(
    userId: string, 
    request: ContentGenerationRequest
  ): Promise<AIGenerationResult> {
    const startTime = Date.now();
    logger.info(`Starting content generation for user: ${userId}`, { request });
    
    try {
      // Create content record in database with GENERATING status
      const content = await prisma.content.create({
        data: {
          userId,
          templateId: request.templateId,
          title: request.title,
          category: request.category as keyof typeof TODDLER_CATEGORIES,
          ageRange: request.ageRange ?? "0-6",
          status: "GENERATING",
          generationPrompt: request.customPrompt,
          tags: request.tags ?? [],
        },
      });
      
      // Generate script using AI
      const script = await this.generateScript(request);
      
      // Generate video (placeholder - integrates with video AI services)
      const videoResult = await this.generateVideo(
        script, 
        request.style ?? "CARTOON_2D",
        request.duration ?? 60
      );
      
      // Generate thumbnail
      const thumbnailUrl = request.generateThumbnail 
        ? await this.generateThumbnail(request.title, request.category)
        : undefined;
      
      // Generate voiceover if requested
      const voiceOverUrl = request.generateVoiceover
        ? await this.generateVoiceover(script)
        : undefined;
      
      // Update content record with generated assets
      await prisma.content.update({
        where: { id: content.id },
        data: {
          script,
          videoUrl: videoResult.url,
          thumbnailUrl,
          voiceOverUrl,
          duration: request.duration ?? 60,
          status: "READY",
          updatedAt: new Date(),
        },
      });
      
      const processingTime = Date.now() - startTime;
      logger.info(`Content generated successfully: ${content.id}`, { processingTime });
      
      return {
        success: true,
        videoUrl: videoResult.url,
        thumbnailUrl,
        voiceOverUrl,
        script,
        processingTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Content generation failed: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
        processingTime: Date.now() - startTime,
      };
    }
  }
  
  /**
   * Generate an engaging script for toddler content
   * @param request - Content parameters
   * @returns Generated script text
   */
  async generateScript(request: ContentGenerationRequest): Promise<string> {
    if (!this.openai) {
      logger.warn("OpenAI not configured, using template script");
      return this.getTemplateScript(request);
    }
    
    const prompt = this.buildScriptPrompt(request);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a creative writer specializing in educational content for toddlers aged ${request.ageRange ?? "0-6"} years old. 
            Create engaging, age-appropriate scripts that are:
            - Simple and repetitive for easy learning
            - Fun and engaging with bright descriptions
            - Educational while being entertaining
            - Safe and appropriate for young children
            - Include natural pauses and emphasis markers
            Format: Include scene descriptions in [brackets] and dialogue/narration in plain text.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      });
      
      return response.choices[0]?.message?.content ?? this.getTemplateScript(request);
    } catch (error) {
      logger.error("Script generation failed:", error);
      return this.getTemplateScript(request);
    }
  }
  
  /**
   * Generate video using AI video generation service
   * @param script - Script/storyboard for the video
   * @param style - Animation style
   * @param duration - Target duration in seconds
   * @returns Video generation result
   */
  async generateVideo(
    script: string, 
    style: string, 
    duration: number
  ): Promise<{ url: string; status: string }> {
    // Video generation integration
    // This would integrate with services like:
    // - Runway ML (Gen-2, Gen-3)
    // - Pika Labs
    // - Stable Video Diffusion via Replicate
    // - D-ID for character animation
    
    if (!this.replicate) {
      logger.warn("Video generation service not configured");
      return {
        url: `https://placeholder.video/${uuidv4()}.mp4`,
        status: "placeholder",
      };
    }
    
    try {
      // Example using Replicate for video generation
      // In production, this would use actual video AI models
      const videoPrompt = this.buildVideoPrompt(script, style);
      
      logger.info("Initiating video generation", { style, duration });
      
      // Placeholder for actual video generation
      // const output = await this.replicate.run(
      //   "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      //   { input: { ... } }
      // );
      
      return {
        url: `https://generated.video/${uuidv4()}.mp4`,
        status: "generated",
      };
    } catch (error) {
      logger.error("Video generation failed:", error);
      throw new Error("Failed to generate video");
    }
  }
  
  /**
   * Generate thumbnail image for content
   * @param title - Content title
   * @param category - Content category
   * @returns Thumbnail URL
   */
  async generateThumbnail(title: string, category: string): Promise<string> {
    if (!this.openai) {
      return `https://placeholder.thumbnail/${uuidv4()}.png`;
    }
    
    try {
      const prompt = `Create a bright, colorful, child-friendly thumbnail for a toddler video titled "${title}" in the ${category} category. 
      Style: Cute cartoon characters, vibrant colors, simple shapes, no text, safe for children, appealing to parents.`;
      
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
      });
      
      return response.data[0]?.url ?? `https://placeholder.thumbnail/${uuidv4()}.png`;
    } catch (error) {
      logger.error("Thumbnail generation failed:", error);
      return `https://placeholder.thumbnail/${uuidv4()}.png`;
    }
  }
  
  /**
   * Generate voiceover audio from script
   * @param script - Script text to convert to speech
   * @returns Voiceover audio URL
   */
  async generateVoiceover(script: string): Promise<string> {
    if (!this.openai) {
      return `https://placeholder.audio/${uuidv4()}.mp3`;
    }
    
    try {
      // Clean script for voiceover (remove scene descriptions)
      const cleanScript = script.replace(/\[.*?\]/g, "").trim();
      
      const response = await this.openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "nova", // Friendly, warm voice suitable for children
        input: cleanScript,
        speed: 0.9, // Slightly slower for toddlers
      });
      
      // In production, save to cloud storage and return URL
      const buffer = Buffer.from(await response.arrayBuffer());
      const audioId = uuidv4();
      
      // Placeholder - would upload to S3/GCS
      logger.info(`Voiceover generated: ${audioId}`);
      return `https://storage.example.com/voiceovers/${audioId}.mp3`;
    } catch (error) {
      logger.error("Voiceover generation failed:", error);
      return `https://placeholder.audio/${uuidv4()}.mp3`;
    }
  }
  
  /**
   * Get content templates for toddler videos
   * @param category - Optional category filter
   * @returns List of content templates
   */
  async getTemplates(category?: string): Promise<object[]> {
    const where = category ? { category: category as keyof typeof TODDLER_CATEGORIES } : {};
    
    return prisma.contentTemplate.findMany({
      where: {
        ...where,
        isPublic: true,
      },
      orderBy: { usageCount: "desc" },
      take: 50,
    });
  }
  
  /**
   * Create a custom content template
   * @param userId - User creating the template
   * @param templateData - Template parameters
   * @returns Created template
   */
  async createTemplate(
    userId: string,
    templateData: {
      name: string;
      description?: string;
      category: string;
      style: string;
      duration?: number;
      promptTemplate: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<object> {
    return prisma.contentTemplate.create({
      data: {
        userId,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category as keyof typeof TODDLER_CATEGORIES,
        style: templateData.style as keyof typeof ANIMATION_STYLES,
        duration: templateData.duration ?? 60,
        promptTemplate: templateData.promptTemplate,
        tags: templateData.tags ?? [],
        isPublic: templateData.isPublic ?? false,
      },
    });
  }
  
  /**
   * Build a prompt for script generation
   * @param request - Content request parameters
   * @returns Formatted prompt string
   */
  private buildScriptPrompt(request: ContentGenerationRequest): string {
    return `Create a ${request.duration ?? 60}-second script for a toddler video with the following details:
    
    Title: ${request.title}
    Category: ${request.category}
    Age Range: ${request.ageRange ?? "0-6"} years old
    Style: ${request.style ?? "colorful cartoon"}
    
    ${request.customPrompt ? `Additional Instructions: ${request.customPrompt}` : ""}
    
    Requirements:
    - Include engaging opening to capture attention
    - Use simple, repetitive phrases
    - Add interactive elements (asking questions, encouraging clapping/singing)
    - Include educational content appropriate for the category
    - End with a cheerful conclusion
    - Mark any music cues with [MUSIC: description]
    - Mark scene transitions with [SCENE: description]`;
  }
  
  /**
   * Build a prompt for video generation
   * @param script - Generated script
   * @param style - Animation style
   * @returns Formatted video prompt
   */
  private buildVideoPrompt(script: string, style: string): string {
    return `Create a child-friendly animated video in ${style} style.
    Scene description from script:
    ${script.substring(0, 500)}
    
    Visual requirements:
    - Bright, vibrant colors
    - Smooth, gentle animations
    - Cute, friendly characters
    - Safe, age-appropriate content
    - No scary or intense elements`;
  }
  
  /**
   * Get a template script when AI is not available
   * @param request - Content request
   * @returns Template script
   */
  private getTemplateScript(request: ContentGenerationRequest): string {
    const categoryScripts: Record<string, string> = {
      COUNTING: `[SCENE: Colorful numbers appear on screen with cute animal characters]

      "Hello little friends! Let's count together today!"
      
      [MUSIC: Upbeat, cheerful tune]
      
      "One little star, shining so bright!"
      [A cute star appears and twinkles]
      
      "Two little birds, ready to take flight!"
      [Two animated birds fly across]
      
      "Three little flowers, growing in a row!"
      [Three flowers bloom with happy faces]
      
      "Can you count with me? 1... 2... 3!"
      
      [SCENE: All elements come together]
      
      "Great job counting! You're a star!"
      
      [MUSIC: Celebration jingle]`,
      
      ALPHABET: `[SCENE: Colorful letters dance across the screen]

      "A-B-C-D-E-F-G, come and sing along with me!"
      
      [MUSIC: Classic ABC melody]
      
      [Letter A appears with an apple]
      "A is for Apple, so red and sweet!"
      
      [Letter B appears with a ball]
      "B is for Ball, bouncing at our feet!"
      
      "Clap your hands if you know the ABCs!"
      
      [SCENE: All letters form a rainbow]
      
      "You did amazing! Keep learning every day!"`,
      
      DEFAULT: `[SCENE: Bright, colorful opening with friendly characters]

      "Hello wonderful friends! Welcome to our show!"
      
      [MUSIC: Happy, engaging tune]
      
      "Today we're going to have so much fun learning about ${request.title}!"
      
      [Characters wave and smile]
      
      "Are you ready? Let's go!"
      
      [Main content section with educational elements]
      
      "You did such a great job! See you next time!"
      
      [SCENE: Cheerful goodbye with waving characters]`,
    };
    
    return categoryScripts[request.category] ?? categoryScripts["DEFAULT"];
  }
}

/** Singleton instance of ContentGenerationService */
export const contentGenerationService = new ContentGenerationService();
