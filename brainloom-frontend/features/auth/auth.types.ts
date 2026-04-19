export type UserRole = "admin" | "public";

export interface User {
  id:        string;
  name?:     string;      // present for regular users, not always for admins
  role:      UserRole;
  scope?:    string;      // "tutorial" | "premium" | "analytics" | "all"
  is_super?: boolean;     // true for super admins
  premium?:  string;      // "1" | "0" (from gateway header)
}