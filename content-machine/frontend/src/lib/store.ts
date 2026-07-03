/**
 * Global state management using Zustand
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Authentication store with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      
      setAuth: (user: User, token: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
        }
        set({ user, accessToken: token, isAuthenticated: true });
      },
      
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * UI state interface
 */
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

/**
 * UI state store
 */
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  activeModal: null,
  openModal: (modalId: string) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));

/**
 * Content creation state interface
 */
interface ContentCreationState {
  currentStep: number;
  formData: {
    title: string;
    category: string;
    style: string;
    duration: number;
    customPrompt: string;
    generateVoiceover: boolean;
    generateThumbnail: boolean;
    tags: string[];
  };
  setStep: (step: number) => void;
  updateFormData: (data: Partial<ContentCreationState["formData"]>) => void;
  resetForm: () => void;
}

const initialFormData: ContentCreationState["formData"] = {
  title: "",
  category: "",
  style: "CARTOON_2D",
  duration: 60,
  customPrompt: "",
  generateVoiceover: true,
  generateThumbnail: true,
  tags: [],
};

/**
 * Content creation state store
 */
export const useContentCreationStore = create<ContentCreationState>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  
  setStep: (step: number) => set({ currentStep: step }),
  
  updateFormData: (data: Partial<ContentCreationState["formData"]>) => {
    set((state) => ({
      formData: { ...state.formData, ...data },
    }));
  },
  
  resetForm: () => set({ currentStep: 1, formData: initialFormData }),
}));
