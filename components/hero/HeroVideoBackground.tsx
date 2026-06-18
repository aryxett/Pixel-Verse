"use client";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function HeroVideoBackground({ youtubeId, accentTheme }: { youtubeId: string, accentTheme: any }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // If the player already exists, just swap the video
    if (playerRef.current && window.YT && window.YT.Player) {
      playerRef.current.loadVideoById(youtubeId);
      // Ensure it starts playing and stays muted
      setTimeout(() => {
        if (playerRef.current && playerRef.current.playVideo) {
          playerRef.current.mute();
          playerRef.current.playVideo();
        }
      }, 500);
      return;
    }

    function initPlayer() {
      if (!containerRef.current || !window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          mute: 1,
          loop: 1,
          playlist: youtubeId
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
          }
        }
      });
    }

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      if (window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    }

    // Cleanup ONLY when component entirely unmounts
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [youtubeId]);

  return (
    <div className="hero-video-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', backgroundColor: '#05050a' }}>
      
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '100vh',
          transform: 'translate(-50%, -50%) scale(1.4)',
          pointerEvents: 'none',
          opacity: 1, /* Always visible to prevent black screen lock */
          transition: 'opacity 0.8s ease-in-out',
          filter: 'brightness(0.65) contrast(1.15) saturate(1.2)'
        }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Dynamic ambient lighting */}
      <div 
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 60% 40%, ${accentTheme.color}20 0%, transparent 70%),
                       radial-gradient(circle at 40% 60%, ${accentTheme.glow}15 0%, transparent 60%)`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: 1, /* Always visible */
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Noise overlay */}
      <div 
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("/noise.png")',
          background: 'linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.05))',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
      
      {/* Invisible shield */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'transparent' }} />
    </div>
  );
}
