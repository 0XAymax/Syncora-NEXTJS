// components/EmojiPicker.tsx
"use client";

import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {Label} from "@radix-ui/react-menu";
import {Plus} from "lucide-react";

export default function EmojiSelector({ onSelectAction,defaultValue} :{onSelectAction : React.Dispatch<React.SetStateAction<string>>,defaultValue?:string}) {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(
        defaultValue ? defaultValue : "");
    return (
        <div className="relative flex items-center gap-2">
            <Label className="text-sm font-medium">Emoji</Label>
            <button
                type="button"
                onClick={() => setShowPicker((prev) => !prev)}
                className="text-2xl rounded-full hover:bg-muted p-1 transition"
            >
                {selectedEmoji == "" && <Plus className="cursor-pointer" />}
                {selectedEmoji}
            </button>

            {showPicker && (
                <div className="absolute z-50 mt-2">
                    <EmojiPicker
                        onEmojiClick={(emojiData) => {
                            setSelectedEmoji(emojiData.emoji);
                            onSelectAction(emojiData.emoji);
                            setShowPicker(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
