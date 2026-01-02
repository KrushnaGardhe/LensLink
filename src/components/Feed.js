import React, { useMemo } from "react";
import { db } from "../lib/instantdb";
import { useStore } from "../../../project/src/store/useStore";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const { isLoading, data } = db.useQuery({
    reactions: {},
    comments: {},
  });

  const setSelectedImage = useStore((s) => s.setSelectedImage);

  const interactions = useMemo(() => {
    if (!data) return [];

    const reactions =
      data.reactions?.map((r) => ({
        ...r,
        type: "reaction",
        text: `${r.userName} reacted ${r.emoji}`,
        content: r.emoji,
      })) ?? [];

    const comments =
      data.comments?.map((c) => ({
        ...c,
        type: "comment",
        text: `${c.userName} commented`,
        content: c.text,
      })) ?? [];

    return [...reactions, ...comments].sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [data]);

  const openImage = (item) => {
    if (!item.imageMetadata) return;

    setSelectedImage({
      id: item.imageId,
      urls: item.imageMetadata.urls,
      user: item.imageMetadata.user,
      description: item.imageMetadata.description,
      alt_description: item.imageMetadata.alt_description,
    });
  };

  // loading – boring on purpose
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
        <Zap size={20} className="mb-2 animate-pulse" />
        loading activity
      </div>
    );
  }

  return (
    <div className="h-full p-4 sm:p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        recent activity
      </h2>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {interactions.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-24">
              no activity yet
            </div>
          ) : (
            interactions.slice(0, 50).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => openImage(item)}
                className="cursor-pointer rounded-xl border border-neutral-100 bg-white p-4 hover:bg-neutral-50 transition"
              >
                <div className="flex gap-3">
                  {/* ICON */}
                  <div className="flex-shrink-0">
                    {item.type === "reaction" ? (
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <span className="text-lg">{item.content}</span>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-gray-500">
                        <MessageCircle size={16} />
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-1">
                      {item.text}
                    </p>

                    {item.type === "comment" && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        “{item.content}”
                      </p>
                    )}

                    <span className="block mt-1 text-[11px] text-gray-400">
                      {formatDistanceToNow(item.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;
