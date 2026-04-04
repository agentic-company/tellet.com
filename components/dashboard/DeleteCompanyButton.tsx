"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteCompanyButton({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch("/api/company/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_id: companyId }),
    });

    if (res.ok) {
      router.push("/onboarding");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete");
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
      >
        Delete company
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-red-400">
        This will permanently delete <strong>{companyName}</strong> and all its
        agents, conversations, knowledge, and scheduled tasks.
      </p>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {deleting ? "Deleting..." : "Yes, delete everything"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
