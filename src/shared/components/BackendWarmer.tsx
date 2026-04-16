"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function BackendWarmer() {
  useEffect(() => {
    // Fire-and-forget ping to wake up Render backend
    fetch(`${API_URL}/health`, { method: "GET" }).catch(() => {});
  }, []);

  return null;
}
