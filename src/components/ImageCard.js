import React from "react";
import { db } from "../lib/instantdb";
import { id } from "@instantdb/react";
import { MessageCircle, User } from "lucide-react";
import { useStore } from "../store/useStore";
import { EMOJIS } from "../constants";
import { motion, AnimatePresence } from "framer-motion";

const ImageCard = ({ image }) => {
  const setSelectedImage = useStore((s) => s.setSelectedImage);
  const user = useStore((s) => s.user);

  const { data } = db.useQuery({
    reactions: { $: { where: { imageId: image.id } } },
    comments: { $: { where: { imageId: image.id } } },
  });

  const reactions = data?.reactions ?? [];
  const comments = data?.comments ?? [];

  const myReaction = reactions.find((r) => r.userId === user.id);

  const counts = reactions.reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  const react = (e, emoji) => {
    e.stopPropagation();

    if (myReaction) {
      db.transact(db.tx.reactions[myReaction.id].delete());
      if (myReaction.emoji === emoji) return;
    }

    db.transact(
      db.tx.reactions[id()].update({
        imageId: image.id,
        emoji,
        userId: user.id,
        userName: user.name,
        timestamp: Date.now(),
        imageMetadata: {
          urls: image.urls,
          user: image.user,
          description: image.description,
          alt_description: image.alt_description,
        },
      })
    );
  };

  return (
    <motion.div
      layout
      onClick={() => setSelectedImage(image)}
      className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200 cursor-pointer"
    >
      {/* image */}
      <img
        src={image.urls.small}
        alt={image.alt_description || ""}
        loading="lazy"
        className="w-full h-full object-cover"
      />

      {/* top user */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-md text-[10px] text-gray-700">
        <User size={12} />
        <span className="truncate max-w-[90px]">
          {image.user.username}
        </span>
      </div>

      {/* bottom actions */}
      <div
        className="absolute bottom-2 left-2 right-2 space-y-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* reactions */}
        <div className="flex gap-1 flex-wrap">
          <AnimatePresence>
            {Object.entries(counts).map(([emoji, count]) => (
              <motion.button
                key={emoji}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => react(e, emoji)}
                className={`px-2 py-1 text-xs rounded border bg-white ${
                  myReaction?.emoji === emoji
                    ? "border-indigo-400"
                    : "border-neutral-200"
                }`}
              >
                {emoji} {count}
              </motion.button>
            ))}
          </AnimatePresence>

          {comments.length > 0 && (
            <div className="px-2 py-1 text-xs rounded bg-white border border-neutral-200 flex items-center gap-1">
              <MessageCircle size={12} />
              {comments.length}
            </div>
          )}
        </div>

        {/* emoji picker */}
        <div className="flex gap-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={(e) => react(e, emoji)}
              className={`w-7 h-7 flex items-center justify-center rounded bg-white border text-sm ${
                myReaction?.emoji === emoji
                  ? "border-indigo-400"
                  : "border-neutral-200"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
