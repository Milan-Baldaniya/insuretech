import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminUploadClient from "./AdminUploadClient";

function configuredValues(raw: string | undefined) {
  return new Set(
    (raw || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isAdmin(user: {
  id?: string;
  email?: string | null;
  app_metadata?: Record<string, unknown>;
}) {
  const metadata = user.app_metadata || {};
  const role = String(metadata.role || "").toLowerCase();
  const metadataAdmin = role === "admin" || metadata.is_admin === true;
  const emailAdmin = configuredValues(process.env.ADMIN_EMAILS).has(
    (user.email || "").toLowerCase(),
  );
  const idAdmin = configuredValues(process.env.ADMIN_USER_IDS).has(
    (user.id || "").toLowerCase(),
  );

  return metadataAdmin || emailAdmin || idAdmin;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!isAdmin(user)) {
    redirect("/");
  }

  return <AdminUploadClient userEmail={user.email || "Admin"} />;
}
