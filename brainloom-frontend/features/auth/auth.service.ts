// 📄 /features/auth/auth.service.ts

import { api } from "@/lib/axios";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/admin/login", { email, password });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/topics/user/me");
    return res.data.user;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/admin/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const res = await api.post("/auth/admin/reset-password", { email, otp, newPassword });
    return res.data;
  },

  // Super admin only
  listAdmins: async () => {
    const res = await api.get("/auth/admin/list");
    return res.data.admins;
  },

  createAdmin: async (data: {
    name: string;
    email: string;
    password: string;
    scope: string;
    phone?: string;
  }) => {
    const res = await api.post("/auth/admin/register", data);
    return res.data;
  },

  deleteAdmin: async (id: number) => {
    const res = await api.delete(`/auth/admin/${id}`);
    return res.data;
  },

  forceResetPassword: async (id: number, newPassword: string) => {
    const res = await api.post(`/auth/admin/${id}/reset-password`, { newPassword });
    return res.data;
  },
};