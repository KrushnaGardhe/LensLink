import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, LogOut, LayoutGrid, Activity } from "lucide-react";

import Gallery from "./components/Gallery";
import Feed from "./components/Feed";
import ImageViewModal from "./components/ImageViewModal";
import Login from "./components/Login";
import { useStore } from "./store/useStore";

import "./index.css";

const App = () => {
  const { user, isLoggedIn, logout, selectedImage } = useStore();
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <>
      <AnimatePresence>{!isLoggedIn && <Login />}</AnimatePresence>

      <div className="min-h-screen flex flex-col bg-white">
        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3">
            
            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white">
                <Camera size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-900 tracking-tight hidden lg:block">
                LensLink
              </span>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-4 py-1.5 text-xs rounded-md flex items-center gap-1 transition ${
                  activeTab === "gallery"
                    ? "bg-white text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={14} />
                explore
              </button>

              <button
                onClick={() => setActiveTab("feed")}
                className={`px-4 py-1.5 text-xs rounded-md flex items-center gap-1 transition ${
                  activeTab === "feed"
                    ? "bg-white text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Activity size={14} />
                feed
              </button>
            </div>

            {/* USER */}
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 ${user.color} rounded-md flex items-center justify-center text-white text-xs font-bold`}
                title={user.name}
              >
                {user.name.charAt(0)}
              </div>

              <button
                onClick={logout}
                className="text-gray-300 hover:text-red-500 transition"
                title="logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-hidden bg-neutral-50/40">
          <AnimatePresence mode="wait">
            {activeTab === "gallery" ? (
              <motion.section
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto p-4 sm:p-6"
              >
                <div className="max-w-6xl mx-auto">
                  <Gallery />
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full overflow-y-auto p-4 sm:p-6"
              >
                <div className="max-w-xl mx-auto">
                  <Feed />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        {/* IMAGE MODAL */}
        <AnimatePresence>
          {selectedImage && <ImageViewModal />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default App;
