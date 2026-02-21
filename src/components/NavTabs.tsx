"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavTabs() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "WebP 변환" },
    { href: "/upload", label: "S3 업로드" },
  ];

  return (
    <div className="flex gap-2 mb-8">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === tab.href
              ? "bg-primary text-primary-foreground"
              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
