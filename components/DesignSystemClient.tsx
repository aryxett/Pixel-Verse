"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Gamepad2, Sparkles, Zap, Star, Heart,
  Search, Bell, ArrowRight, Download, Play,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/Card";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Badge, { GlowBadge } from "@/components/ui/Badge";
import Avatar, { AvatarGroup } from "@/components/ui/Avatar";
import ProgressBar, { CircularProgress } from "@/components/ui/ProgressBar";
import Tooltip from "@/components/ui/Tooltip";
import Modal from "@/components/ui/Modal";
import Divider from "@/components/ui/Divider";
import { CardSkeleton } from "@/components/ui/Skeleton";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
        <h2 className="text-xl font-bold gradient-text whitespace-nowrap">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-l from-violet-500/50 to-transparent" />
      </div>
      {children}
    </motion.section>
  );
}

export default function DesignSystemClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <GlowBadge variant="purple">
          <Sparkles className="w-4 h-4" /> Design System
        </GlowBadge>
        <h1 className="text-5xl font-black">
          <span className="gradient-text">PixelVerse</span> UI Kit
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Futuristic dark-theme components with neon accents, glassmorphism, and Framer Motion animations.
        </p>
      </motion.div>

      {/* ── BUTTONS ── */}
      <Section title="Buttons">
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <p className="text-xs text-slate-500 mb-3 font-mono">Variants</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" icon={<Zap className="w-4 h-4" />}>Primary</Button>
              <Button variant="secondary" icon={<Star className="w-4 h-4" />}>Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="cyan" icon={<Play className="w-4 h-4" />}>Cyan</Button>
              <Button variant="pink" icon={<Heart className="w-4 h-4" />}>Pink</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-xs text-slate-500 mb-3 font-mono">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>

          {/* States */}
          <div>
            <p className="text-xs text-slate-500 mb-3 font-mono">States</p>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Icon Right
              </Button>
              <Button variant="secondary" fullWidth>Full Width</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── CARDS ── */}
      <Section title="Cards">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default" glowColor="purple">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardBody>Glass morphism with purple glow on hover. Perfect for game listings.</CardBody>
            <CardFooter>
              <Button size="sm" variant="secondary">View</Button>
              <Button size="sm">Play</Button>
            </CardFooter>
          </Card>

          <Card variant="glow" glowColor="cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Glow Card</CardTitle>
                <Badge variant="cyan" dot pulse>Live</Badge>
              </div>
            </CardHeader>
            <CardBody>Enhanced border glow with cyan accent. Great for featured content.</CardBody>
            <CardFooter>
              <Button size="sm" variant="cyan">Explore</Button>
            </CardFooter>
          </Card>

          <Card variant="neon" glowColor="pink">
            <CardHeader>
              <CardTitle>Neon Card</CardTitle>
            </CardHeader>
            <CardBody>Deep dark background with neon pink accent. Ideal for premium items.</CardBody>
            <CardFooter>
              <Button size="sm" variant="pink" icon={<Download className="w-3.5 h-3.5" />}>
                Download
              </Button>
            </CardFooter>
          </Card>

          {/* Skeleton */}
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Section>

      {/* ── INPUTS ── */}
      <Section title="Inputs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Search Games"
            placeholder="Elden Ring, Hades..."
            icon={<Search className="w-4 h-4" />}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            hint="Search by title, genre, or developer"
          />
          <Input
            label="With Error"
            placeholder="Enter username"
            error="Username already taken"
            icon={<Gamepad2 className="w-4 h-4" />}
          />
          <Input
            label="Cyan Glow"
            placeholder="Focus to see cyan glow"
            glowColor="cyan"
          />
          <Input
            label="Pink Glow"
            placeholder="Focus to see pink glow"
            glowColor="pink"
          />
          <Textarea
            label="Bio"
            placeholder="Tell us about your gaming style..."
            rows={3}
            hint="Max 200 characters"
          />
          <Select
            label="Favorite Genre"
            options={[
              { value: "rpg", label: "RPG" },
              { value: "fps", label: "FPS" },
              { value: "strategy", label: "Strategy" },
              { value: "roguelike", label: "Roguelike" },
            ]}
          />
        </div>
      </Section>

      {/* ── BADGES ── */}
      <Section title="Badges">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge variant="purple">Purple</Badge>
            <Badge variant="cyan">Cyan</Badge>
            <Badge variant="pink">Pink</Badge>
            <Badge variant="green">Green</Badge>
            <Badge variant="amber">Amber</Badge>
            <Badge variant="red">Red</Badge>
            <Badge variant="slate">Slate</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="purple" dot>Online</Badge>
            <Badge variant="green" dot pulse>Live</Badge>
            <Badge variant="amber" dot>Away</Badge>
            <Badge variant="red" dot>Offline</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="purple" size="sm">Small</Badge>
            <Badge variant="cyan" size="md">Medium</Badge>
            <Badge variant="pink" size="lg">Large</Badge>
          </div>
          <div className="flex flex-wrap gap-3">
            <GlowBadge variant="purple"><Sparkles className="w-4 h-4" /> AI Powered</GlowBadge>
            <GlowBadge variant="cyan"><Zap className="w-4 h-4" /> Fast</GlowBadge>
            <GlowBadge variant="pink"><Star className="w-4 h-4" /> Featured</GlowBadge>
          </div>
        </div>
      </Section>

      {/* ── AVATARS ── */}
      <Section title="Avatars">
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-4">
            <Avatar size="xs" fallback="XS" />
            <Avatar size="sm" fallback="SM" />
            <Avatar size="md" fallback="MD" />
            <Avatar size="lg" fallback="LG" glow glowColor="purple" />
            <Avatar size="xl" fallback="XL" glow glowColor="cyan" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Avatar size="md" fallback="ON" status="online" />
            <Avatar size="md" fallback="AW" status="away" />
            <Avatar size="md" fallback="OF" status="offline" />
            <Avatar size="md" fallback="RD" variant="rounded" glow />
          </div>
          <AvatarGroup
            size="md"
            avatars={[
              { alt: "Player 1", fallback: "P1" },
              { alt: "Player 2", fallback: "P2" },
              { alt: "Player 3", fallback: "P3" },
              { alt: "Player 4", fallback: "P4" },
              { alt: "Player 5", fallback: "P5" },
              { alt: "Player 6", fallback: "P6" },
            ]}
            max={4}
          />
        </div>
      </Section>

      {/* ── PROGRESS ── */}
      <Section title="Progress">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <ProgressBar value={85} color="purple" label="Strategy" showValue glow />
            <ProgressBar value={72} color="cyan"   label="Action"   showValue glow delay={0.1} />
            <ProgressBar value={90} color="pink"   label="Exploration" showValue glow delay={0.2} />
            <ProgressBar value={60} color="green"  label="Social"   showValue glow delay={0.3} />
            <ProgressBar value={45} color="amber"  label="Creativity" showValue glow delay={0.4} />
          </div>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <CircularProgress value={85} color="purple" label="Strategy" />
            <CircularProgress value={72} color="cyan"   label="Action" />
            <CircularProgress value={90} color="pink"   label="Explore" />
            <CircularProgress value={60} color="green"  label="Social" />
          </div>
        </div>
      </Section>

      {/* ── TOOLTIPS ── */}
      <Section title="Tooltips">
        <div className="flex flex-wrap gap-6 justify-center py-8">
          <Tooltip content="Top tooltip" position="top">
            <Button variant="secondary" size="sm">Hover Top</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" position="bottom">
            <Button variant="secondary" size="sm">Hover Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" position="left">
            <Button variant="secondary" size="sm">Hover Left</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" position="right">
            <Button variant="secondary" size="sm">Hover Right</Button>
          </Tooltip>
        </div>
      </Section>

      {/* ── MODAL ── */}
      <Section title="Modal">
        <div className="flex gap-4">
          <Button onClick={() => setModalOpen(true)} icon={<Bell className="w-4 h-4" />}>
            Open Modal
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Game Achievement Unlocked 🏆"
          description="You've discovered the PixelVerse Design System"
        >
          <div className="space-y-4">
            <p className="text-slate-400 text-sm leading-relaxed">
              This modal uses Framer Motion spring animations, backdrop blur, and the full glassmorphism design language.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </Section>

      {/* ── DIVIDERS ── */}
      <Section title="Dividers">
        <div className="space-y-6">
          <Divider />
          <Divider color="purple" />
          <Divider label="OR" />
          <Divider label="Continue with" color="purple" />
        </div>
      </Section>

      {/* ── TYPOGRAPHY ── */}
      <Section title="Typography">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-slate-100">Heading 1</h1>
          <h2 className="text-4xl font-bold text-slate-100">Heading 2</h2>
          <h3 className="text-3xl font-bold text-slate-200">Heading 3</h3>
          <h4 className="text-2xl font-semibold text-slate-200">Heading 4</h4>
          <p className="text-base text-slate-400 leading-relaxed max-w-xl">
            Body text — Inter font, slate-400. Used for descriptions and supporting content throughout the interface.
          </p>
          <p className="text-sm text-slate-500">Small text — slate-500. Used for hints, metadata, and secondary info.</p>
          <p className="gradient-text text-2xl font-bold">Gradient Text — Purple → Cyan → Pink</p>
          <p className="gradient-text-gold text-2xl font-bold">Gold Gradient — Amber → Yellow → Orange</p>
          <code className="text-sm font-mono text-violet-300 bg-violet-900/20 px-2 py-1 rounded-lg">
            font-mono code snippet
          </code>
        </div>
      </Section>

      {/* ── COLORS ── */}
      <Section title="Color Palette">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Violet 600", bg: "bg-violet-600", hex: "#7c3aed" },
            { name: "Cyan 500",   bg: "bg-cyan-500",   hex: "#06b6d4" },
            { name: "Pink 500",   bg: "bg-pink-500",   hex: "#ec4899" },
            { name: "Emerald 500",bg: "bg-emerald-500",hex: "#10b981" },
            { name: "Amber 500",  bg: "bg-amber-500",  hex: "#f59e0b" },
            { name: "Slate 800",  bg: "bg-slate-800",  hex: "#1e293b" },
            { name: "BG Primary", bg: "bg-[#0a0a0f]",  hex: "#0a0a0f" },
            { name: "BG Card",    bg: "bg-[#1a1a2e]",  hex: "#1a1a2e" },
          ].map((c) => (
            <div key={c.name} className="space-y-2">
              <div className={`h-16 rounded-xl ${c.bg} border border-white/10`} />
              <p className="text-xs font-medium text-slate-300">{c.name}</p>
              <p className="text-xs text-slate-500 font-mono">{c.hex}</p>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}
