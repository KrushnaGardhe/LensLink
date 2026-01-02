import React from "react";
import { EMOJIS } from "../../../project/src/constants";

const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-lg">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="px-1.5 py-1 text-lg rounded hover:bg-neutral-100 transition"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
