import type { Metadata } from "next";
import { AccountForms } from "@/components/admin/account-forms";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AdminAccountPage() {
  const session = await auth();
  const admin = session?.user?.id
    ? await db.admin.findUnique({
        where: { id: session.user.id },
        select: { email: true },
      })
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Account</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Change the username and password for this admin login.
        </p>
      </div>

      {admin ? (
        <AccountForms email={admin.email} />
      ) : (
        <p className="text-sm text-fg-muted">This session is not linked to an admin account.</p>
      )}
    </div>
  );
}
