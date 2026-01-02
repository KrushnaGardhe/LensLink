import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

import { useUnsplash } from "../../../project/src/hooks/useUnsplash";
import ImageCard from "./ImageCard";

const Gallery = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useUnsplash();

  const { ref, inView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // loading – simple & boring (human style)
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`aspect-[4/5] bg-gray-100 animate-pulse
              ${i % 2 === 0 ? "rounded-xl" : "rounded-2xl"}`}
          />
        ))}
      </div>
    );
  }

  // error – no drama
  if (isError) {
    return (
      <div className="py-20 text-center text-sm text-red-600">
        <AlertCircle className="mx-auto mb-2" size={32} />
        Somthing Happpend Refresh Again
      </div>
    );
  }

  const images = data?.pages.flat() ?? [];

  return (
    <div className="pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
          >
            <ImageCard image={img} />
          </motion.div>
        ))}
      </div>

      <div ref={ref} className="mt-10 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            loading
          </div>
        )}

        {!isFetchingNextPage && !hasNextPage && (
          <span className="text-xs text-gray-400">
            You Reach The End
          </span>
        )}
      </div>
    </div>
  );
};

export default Gallery;
