import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdminUser } from "@/lib/adminAuth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-paper">{children}</div>
    </div>
  );
}
