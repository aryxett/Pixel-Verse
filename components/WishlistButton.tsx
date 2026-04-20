"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { addToWishlist, removeFromWishlist, isWishlisted } from "@/lib/library";

interface Props {
  id: string; title: string; image: string;
  rating?: number; metacritic?: number | null;
  genre?: string[]; developer?: string; releaseYear?: number;
}

export default function WishlistButton({ id, title, image, rating = 0, metacritic, genre = [], developer, releaseYear }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setWishlisted(isWishlisted(id));
    const h = () => setWishlisted(isWishlisted(id));
    window.addEventListener("library-updated", h);
    return () => window.removeEventListener("library-updated", h);
  }, [id]);

  const toggle = () => {
    if (wishlisted) {
      removeFromWishlist(id);
      setWishlisted(false);
    } else {
      addToWishlist({ id, title, image, rating, metacritic, genre, developer, releaseYear });
      setWishlisted(true);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.85 }}
      animate={pulse ? { scale: [1, 1.4, 1] } : {}}
      transition={{ duration: 0.3 }}
      onClick={toggle}
      title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      className="w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all"
      style={{
        background: wishlisted ? "rgba(6,182,212,0.25)" : "rgba(5,5,10,0.85)",
        borderColor: wishlisted ? "rgba(6,182,212,0.8)" : "rgba(255,255,255,0.25)",
        backdropFilter: "blur(10px)",
        boxShadow: wishlisted ? "0 0 16px rgba(6,182,212,0.5)" : "0 2px 8px rgba(0,0,0,0.5)",
        color: wishlisted ? "#06b6d4" : "#c4b5fd",
      }}
    >
      <Bookmark className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
    </motion.button>
  );
}
