import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateRandomUser } from "../constants";

export const useStore = create(
  persist(
    (set) => ({
      user: generateRandomUser(),
      isLoggedIn: false,
      selectedImage: null,

      setSelectedImage: (image) => set({ selectedImage: image }),

      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      login: (username) => {
        const cleanName = username.trim();

        
        const derivedId = `u_${cleanName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")}`;

        set((state) => ({
          isLoggedIn: true,
          user: {
            ...state.user,
            id: derivedId,
            name: cleanName,
          },
        }));
      },

      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "lenslink-storage",
    }
  )
);
