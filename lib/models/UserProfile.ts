/**
 * MongoDB schema for user gamer profiles
 * Falls back to localStorage when DB is not available
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserProfile extends Document {
  username: string;
  avatar: string;
  archetype: string;
  description: string;
  favoriteGames: string[];
  playStyle: string;
  hoursPerWeek: number;
  strengths: string[];
  recommendations: string[];
  playstyleScore: {
    strategy: number;
    action: number;
    exploration: number;
    social: number;
    creativity: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    avatar: { type: String, default: "" },
    archetype: { type: String, default: "The Explorer" },
    description: { type: String, default: "" },
    favoriteGames: [{ type: String }],
    playStyle: {
      type: String,
      enum: ["casual", "hardcore", "competitive", "story-driven", "creative"],
      default: "casual",
    },
    hoursPerWeek: { type: Number, default: 10, min: 0, max: 168 },
    strengths: [{ type: String }],
    recommendations: [{ type: String }],
    playstyleScore: {
      strategy: { type: Number, default: 50, min: 0, max: 100 },
      action: { type: Number, default: 50, min: 0, max: 100 },
      exploration: { type: Number, default: 50, min: 0, max: 100 },
      social: { type: Number, default: 50, min: 0, max: 100 },
      creativity: { type: Number, default: 50, min: 0, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model re-compilation in Next.js dev mode
const UserProfile: Model<IUserProfile> =
  (mongoose.models.UserProfile as Model<IUserProfile>) ||
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);

export default UserProfile;
