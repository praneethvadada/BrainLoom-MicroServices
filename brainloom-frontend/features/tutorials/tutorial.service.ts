// 📄 /features/tutorials/tutorial.service.ts

import { api } from "@/lib/axios";

// ── Types ──────────────────────────────────────────────────────────────────
export interface Domain {
  id:           number;
  parent_id:    number | null;
  title:        string;
  slug:         string;
  description:  string | null;
  full_path:    string;
  order_no:     number;
  is_published: number;
  child_count?: number;   // populated when includeChildCount=true
  created_at:   string;
  updated_at:   string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
/** Convert a title to a URL-safe slug */
export const titleToSlug = (title: string) =>
  title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// ── Public (no auth needed) ────────────────────────────────────────────────
export const tutorialService = {
  // Root domains — returns { count, topics: [] } from the controller
  getRootDomains: async (): Promise<Domain[]> => {
    const res = await api.get("/topics");
    const d = res.data;
    if (Array.isArray(d))           return d;
    if (Array.isArray(d?.topics))   return d.topics;
    if (Array.isArray(d?.data))     return d.data;
    return [];
  },

  // Immediate children of a domain (pass null for root)
  getChildren: async (parentId: number | null): Promise<Domain[]> => {
    const id = parentId === null ? "null" : parentId;
    const res = await api.get(`/topics/children/${id}`);
    const d = res.data;
    if (Array.isArray(d))           return d;
    if (Array.isArray(d?.children)) return d.children;
    if (Array.isArray(d?.topics))   return d.topics;
    return [];
  },

  // Single domain by id
  getById: async (id: number): Promise<Domain | null> => {
    const res = await api.get(`/topics/${id}`);
    return res.data.topic ?? res.data ?? null;
  },

  // ── Admin only (requires tutorial/all scope) ───────────────────────────
  createDomain: async (data: {
    parent_id?:    number | null;
    title:         string;
    slug:          string;
    description?:  string;
    is_published?: number;
  }): Promise<{ id: number }> => {
    const res = await api.post("/topics/add", data);
    return res.data;
  },

  updateDomain: async (id: number, data: {
    title?:        string;
    slug?:         string;
    description?:  string;
    is_published?: number;
  }): Promise<void> => {
    await api.put(`/topics/${id}`, data);
  },

  deleteDomain: async (id: number): Promise<void> => {
    await api.delete(`/topics/${id}`);
  },

  // Fetch domain by slug path (e.g. "python" or "python/basics/functions")
  // Returns { topic, blocks, children } or null
  getBySlugPath: async (slugPath: string): Promise<{ topic: Domain; blocks: any[]; children: Domain[] } | null> => {
    const res = await api.get(`/topics/slug/${slugPath}`);
    if (!res.data || !res.data.topic) return null;
    return res.data;
  },

  // Legacy compat
  getAll: async (): Promise<Domain[]> => {
    const res = await api.get("/topics");
    return res.data.topics ?? res.data ?? [];
  },

  getBySlug: async (slug: string): Promise<Domain | null> => {
    const res = await api.get(`/topics/slug/${slug}`);
    return res.data ?? null;
  },
};