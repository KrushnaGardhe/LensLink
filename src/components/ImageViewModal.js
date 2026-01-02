import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store/useStore";
import { db } from "../lib/instantdb";
import { id } from "@instantdb/react";
import { X, Send, Trash2, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { EMOJIS } from "../constants";

const ImageViewModal = () => {
  const { selectedImage, setSelectedImage, user } = useStore();
  const [text, setText] = useState("");
  const listRef = useRef(null);

  const { isLoading, data } = db.useQuery(
    selectedImage
      ? {
          reactions: { $: { where: { imageId: selectedImage.id } } },
          comments: { $: { where: { imageId: selectedImage.id } } },
        }
      : {}
  );

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [data?.comments]);

  if (!selectedImage) return null;

  const reactions = data?.reactions ?? [];
  const comments = (data?.comments ?? []).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const myReaction = reactions.find((r) => r.userId === user.id);

  const toggleReaction = (emoji) => {
    if (myReaction) {
      db.transact(db.tx.reactions[myReaction.id].delete());
      if (myReaction.emoji === emoji) return;
    }

    db.transact(
      db.tx.reactions[id()].update({
        imageId: selectedImage.id,
        emoji,
        userId: user.id,
        userName: user.name,
        timestamp: Date.now(),
        imageMetadata: {
          urls: selectedImage.urls,
          user: selectedImage.user,
          description: selectedImage.description,
          alt_description: selectedImage.alt_description,
        },
      })
    );
  };

  const sendComment = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    db.transact(
      db.tx.comments[id()].update({
        imageId: selectedImage.id,
        text: text.trim(),
        userId: user.id,
        userName: user.name,
        timestamp: Date.now(),
        imageMetadata: {
          urls: selectedImage.urls,
          user: selectedImage.user,
          description: selectedImage.description,
          alt_description: selectedImage.alt_description,
        },
      })
    );

    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2">
      <div className="bg-white w-full h-full md:max-w-6xl md:h-[90vh] rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* image */}
        <div className="md:w-2/3 bg-black flex items-center justify-center">
          <img
            src={selectedImage.urls.regular}
            alt=""
            className="max-h-full max-w-full"
          />
        </div>

        {/* side */}
        <div className="flex-1 flex flex-col border-l">
          {/* header */}
          <div className="flex items-center justify-between p-3 border-b">
            <span className="text-sm font-semibold">
              @{selectedImage.user.username}
            </span>
            <button onClick={() => setSelectedImage(null)}>
              <X size={18} />
            </button>
          </div>

          {/* reactions */}
          <div className="flex gap-1 p-3 border-b">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => toggleReaction(e)}
                className={`px-2 py-1 text-sm border rounded ${
                  myReaction?.emoji === e
                    ? "border-indigo-400"
                    : "border-neutral-200"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* comments */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 text-sm"
          >
            {isLoading && (
              <div className="text-center text-gray-400">loading</div>
            )}

            {!isLoading && comments.length === 0 && (
              <div className="text-center text-gray-400 flex flex-col items-center gap-1">
                <MessageCircle size={16} />
                no comments yet
              </div>
            )}

            {comments.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{c.userName}</span>
                  <span>
                    {formatDistanceToNow(c.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1">{c.text}</p>

                {c.userId === user.id && (
                  <button
                    onClick={() =>
                      db.transact(db.tx.comments[c.id].delete())
                    }
                    className="text-xs text-red-400 mt-1 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* input */}
          <form
            onSubmit={sendComment}
            className="border-t p-2 flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="comment…"
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              disabled={!text.trim()}
              className="px-3 text-sm border rounded disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageViewModal;
