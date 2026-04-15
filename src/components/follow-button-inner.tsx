"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  targetSlug: string;
  targetType: "company" | "person" | "nonprofit";
  className?: string;
}

interface FollowEntry {
  slug: string;
  type: string;
}

// ── Global reactive store for follows ─────────────────────────────
const listeners = new Set<() => void>();
let followsSnapshot: FollowEntry[] = [];
let fetchedForUser: string | null = null;
let fetching = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return followsSnapshot;
}

function getServerSnapshot(): FollowEntry[] {
  return [];
}

function notify() {
  listeners.forEach((l) => l());
}

/** Fetch follows from the API and update the in-memory store. */
async function fetchFollows() {
  if (fetching) return;
  fetching = true;
  try {
    const res = await fetch("/api/follows");
    if (res.ok) {
      const data = await res.json();
      followsSnapshot = (data.follows ?? []).map(
        (f: { targetSlug: string; targetType: string }) => ({
          slug: f.targetSlug,
          type: f.targetType,
        })
      );
      notify();
    }
  } catch {
    // Silently fail — localStorage fallback removed, user just won't see follows
  } finally {
    fetching = false;
  }
}

/** Optimistically add/remove then sync with API. */
async function addFollow(slug: string, type: string) {
  // Optimistic update
  followsSnapshot = [...followsSnapshot, { slug, type }];
  notify();

  try {
    await fetch("/api/follows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetSlug: slug, targetType: type }),
    });
  } catch {
    // Revert on failure
    followsSnapshot = followsSnapshot.filter(
      (f) => !(f.slug === slug && f.type === type)
    );
    notify();
  }
}

async function removeFollow(slug: string, type: string) {
  const prev = followsSnapshot;
  // Optimistic update
  followsSnapshot = followsSnapshot.filter(
    (f) => !(f.slug === slug && f.type === type)
  );
  notify();

  try {
    await fetch("/api/follows", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetSlug: slug, targetType: type }),
    });
  } catch {
    // Revert on failure
    followsSnapshot = prev;
    notify();
  }
}

// ── Component ─────────────────────────────────────────────────────
export default function FollowButtonInner({
  targetSlug,
  targetType,
  className,
}: FollowButtonProps) {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();

  // Initialize fetch when user is known
  useEffect(() => {
    if (isSignedIn && userId && fetchedForUser !== userId) {
      fetchedForUser = userId;
      fetchFollows();
    }
  }, [isSignedIn, userId]);

  const follows = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isFollowing = follows.some(
    (f) => f.slug === targetSlug && f.type === targetType
  );

  const handleClick = useCallback(() => {
    if (!isSignedIn || !userId) {
      router.push("/login");
      return;
    }

    if (isFollowing) {
      removeFollow(targetSlug, targetType);
    } else {
      addFollow(targetSlug, targetType);
    }
  }, [isSignedIn, userId, isFollowing, targetSlug, targetType, router]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
        isFollowing
          ? "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
          : "bg-cyan-600 text-white hover:bg-cyan-700",
        className
      )}
    >
      <Heart
        className={cn("h-4 w-4", isFollowing && "fill-cyan-600 text-cyan-600")}
      />
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

/**
 * Reactive hook — re-renders when follows change.
 * Fetches from API on first mount for the current user.
 */
export function useFollows(): FollowEntry[] {
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (isSignedIn && userId && fetchedForUser !== userId) {
      fetchedForUser = userId;
      fetchFollows();
    }
  }, [isSignedIn, userId]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Force refetch follows from the API (useful after mutations elsewhere).
 */
export function refreshFollows() {
  fetchFollows();
}
