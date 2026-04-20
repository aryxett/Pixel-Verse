"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookmarkCheck, Check } from "lucide-react";
import { addToLibrary, removeFromLibrary, getGameStatus, type LibraryStatus } from "@/lib/library";

interface Props {
  id: string; title: string; image: string;
  rating?: number; metacritic?: number | null;
  genre?: string[]; developer?: string; releaseYear?: number;
}

export default function AddToLibraryButton({ id, title, image, rating = 0, metacritic, genre = [], developer, releaseYear }: Props) {
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [pulse, setPulse]   = useState(false);

  useEffect(() => {
    setStatus(getGameStatus(id));
    const h = () => setStatus(getGameStatus(id));
    window.addEventListener("library-updated", h);
    return () => window.removeEventListener("library-updated", h);
  }, [id]);

  const toggle = () => {
    if (status) {
      removeFromLibrary(id);
      setStatus(null);
    } else {
      addToLibrary({ id, title, image, rating, metacritic, genre, developer, releaseYear, status: "backlog" });
      setStatus("backlog");
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }
  };

  const added = !!status;

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      animate={pulse ? { scale: [1, 1.06, 1] } : {}}
      onClick={toggle}
      className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm border transition-all"
      style={{
        background: added ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)",
        borderColor: added ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.3)",
        color: added ? "#c4b5fd" : "#a78bfa",
        boxShadow: added ? "0 0 24px rgba(124,58,237,0.3)" : "none",
      }}
    >
      {added ? <Check className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
      {added ? "In Library" : "Add to Library"}
    </motion.button>
  );
}
