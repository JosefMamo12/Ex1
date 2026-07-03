/**
 * Create Content page - AI video generation wizard
 */

"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Video,
  Music,
  Image,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { cn, getCategoryName, getStyleName } from "@/lib/utils";

/**
 * Categories for toddler content
 */
const categories = [
  { id: "NURSERY_RHYMES", name: "Nursery Rhymes", emoji: "🎵", duration: 120 },
  { id: "COUNTING", name: "Counting & Numbers", emoji: "🔢", duration: 90 },
  { id: "ALPHABET", name: "Alphabet & Letters", emoji: "🔤", duration: 90 },
  { id: "COLORS", name: "Colors", emoji: "🌈", duration: 60 },
  { id: "SHAPES", name: "Shapes", emoji: "⬡", duration: 60 },
  { id: "ANIMALS", name: "Animals", emoji: "🐾", duration: 90 },
  { id: "VEHICLES", name: "Vehicles", emoji: "🚗", duration: 90 },
  { id: "NATURE", name: "Nature", emoji: "🌿", duration: 90 },
  { id: "BEDTIME", name: "Bedtime & Lullabies", emoji: "🌙", duration: 180 },
  { id: "EDUCATIONAL", name: "Educational", emoji: "📚", duration: 120 },
  { id: "MUSIC_DANCE", name: "Music & Dance", emoji: "💃", duration: 90 },
  { id: "STORIES", name: "Stories", emoji: "📖", duration: 180 },
];

/**
 * Animation styles
 */
const styles = [
  { id: "CARTOON_2D", name: "2D Cartoon", description: "Classic flat cartoon style" },
  { id: "CARTOON_3D", name: "3D Cartoon", description: "Modern 3D animated" },
  { id: "CLAY_ANIMATION", name: "Clay Animation", description: "Stop-motion claymation" },
  { id: "WATERCOLOR", name: "Watercolor", description: "Soft artistic style" },
  { id: "MINIMALIST", name: "Minimalist", description: "Clean geometric designs" },
  { id: "COLORFUL_ABSTRACT", name: "Colorful Abstract", description: "Bright abstract patterns" },
];

/**
 * Duration options
 */
const durations = [
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "90", label: "1.5 minutes" },
  { value: "120", label: "2 minutes" },
  { value: "180", label: "3 minutes" },
  { value: "300", label: "5 minutes" },
];

/**
 * Create Content Page component
 */
export default function CreateContentPage(): React.JSX.Element {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    style: "CARTOON_2D",
    duration: "60",
    customPrompt: "",
    generateVoiceover: true,
    generateThumbnail: true,
    tags: [] as string[],
  });

  const handleCategorySelect = (categoryId: string): void => {
    const category = categories.find((c) => c.id === categoryId);
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      duration: category?.duration.toString() ?? "60",
    }));
  };

  const handleStyleSelect = (styleId: string): void => {
    setFormData((prev) => ({ ...prev, style: styleId }));
  };

  const handleGenerate = async (): Promise<void> => {
    setLoading(true);
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading(false);
    setStep(4); // Move to success step
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!formData.category;
      case 2:
        return !!formData.title && formData.title.length >= 3;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-toddler-purple" />
          Create New Video
        </h1>
        <p className="text-gray-600 mt-1">
          Generate AI-powered content for toddlers
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                step >= s
                  ? "bg-gradient-to-br from-toddler-pink to-toddler-purple text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 4 && (
              <div
                className={cn(
                  "w-16 h-1 mx-2 rounded-full transition-all",
                  step > s ? "bg-toddler-purple" : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {/* Step 1: Select Category */}
        {step === 1 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Choose a Category
              </h2>
              <p className="text-gray-600 mb-6">
                What type of content do you want to create?
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "p-4 rounded-xl text-center transition-all border-2",
                      formData.category === category.id
                        ? "border-toddler-purple bg-toddler-purple/5"
                        : "border-transparent bg-gray-50 hover:bg-gray-100"
                    )}
                  >
                    <span className="text-3xl mb-2 block">{category.emoji}</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Content Details */}
        {step === 2 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Content Details
              </h2>
              <p className="text-gray-600 mb-6">
                Tell us more about your video
              </p>
              <div className="space-y-6">
                <Input
                  label="Video Title"
                  placeholder="e.g., Learn Colors with Rainbow Friends"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <Textarea
                  label="Custom Instructions (Optional)"
                  placeholder="Add any specific details about what you want in the video..."
                  value={formData.customPrompt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customPrompt: e.target.value,
                    }))
                  }
                  rows={4}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    options={durations}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Age Range
                    </label>
                    <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
                      0-6 years old
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Style & Options */}
        {step === 3 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Visual Style & Options
              </h2>
              <p className="text-gray-600 mb-6">
                Choose the animation style and additional options
              </p>

              {/* Style Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Animation Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleSelect(style.id)}
                      className={cn(
                        "p-4 rounded-xl text-left transition-all border-2",
                        formData.style === style.id
                          ? "border-toddler-purple bg-toddler-purple/5"
                          : "border-transparent bg-gray-50 hover:bg-gray-100"
                      )}
                    >
                      <span className="font-medium text-gray-900 block">
                        {style.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {style.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.generateVoiceover}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          generateVoiceover: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-gray-300 text-toddler-purple focus:ring-toddler-purple"
                    />
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-toddler-purple" />
                      <div>
                        <span className="font-medium text-gray-900">
                          Generate Voiceover
                        </span>
                        <p className="text-xs text-gray-500">
                          AI-generated narration for the video
                        </p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.generateThumbnail}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          generateThumbnail: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded border-gray-300 text-toddler-purple focus:ring-toddler-purple"
                    />
                    <div className="flex items-center gap-3">
                      <Image className="w-5 h-5 text-toddler-pink" />
                      <div>
                        <span className="font-medium text-gray-900">
                          Generate Thumbnail
                        </span>
                        <p className="text-xs text-gray-500">
                          Eye-catching thumbnail for better clicks
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Generating / Success */}
        {step === 4 && (
          <Card>
            <CardContent className="p-12 text-center">
              {loading ? (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-toddler-pink to-toddler-purple flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Generating Your Video...
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Our AI is creating amazing content for you
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    This usually takes 1-3 minutes
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-toddler-green to-green-400 flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Video Created Successfully!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Your "{formData.title}" video is ready
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setStep(1);
                        setFormData({
                          title: "",
                          category: "",
                          style: "CARTOON_2D",
                          duration: "60",
                          customPrompt: "",
                          generateVoiceover: true,
                          generateThumbnail: true,
                          tags: [],
                        });
                      }}
                    >
                      Create Another
                    </Button>
                    <Button leftIcon={<Video className="w-5 h-5" />}>
                      View Content
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                loading={loading}
                leftIcon={<Sparkles className="w-5 h-5" />}
              >
                Generate Video
              </Button>
            )}
          </div>
        )}

        {/* Summary Panel (visible from step 2) */}
        {step >= 2 && step < 4 && (
          <Card className="mt-6 bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Summary
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-lg text-sm">
                  📂 {getCategoryName(formData.category)}
                </span>
                {formData.title && (
                  <span className="px-3 py-1 bg-white rounded-lg text-sm">
                    📝 {formData.title}
                  </span>
                )}
                <span className="px-3 py-1 bg-white rounded-lg text-sm">
                  🎨 {getStyleName(formData.style)}
                </span>
                <span className="px-3 py-1 bg-white rounded-lg text-sm">
                  ⏱️ {formData.duration}s
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
