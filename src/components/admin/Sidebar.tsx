"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Globe, GraduationCap, HelpCircle, MessageSquare, FileText, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNewApplicationsCount } from "@/app/admin/(cms)/muraciyyatler/actions";

const NAV = [
  { href: "/admin", label: "Ana", icon: LayoutDashboard },
  { href: "/admin/muraciyyatler", label: "Müraciətlər", icon: Inbox },
  { href: "/admin/olkeler", label: "Ölkələr", icon: Globe },
  { href: "/admin/universitetler", label: "Universitetlər", icon: GraduationCap },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/testimoniallar", label: "Testimoniallar", icon: MessageSquare },
  { href: "/admin/sayt-mezmunu", label: "Sayt Məzmunu", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [newCount, setNewCount] = useState(0);

  // Dashboard-a hər daxil olanda və səhifə dəyişəndə yeni müraciətlərin sayını yenilə
  useEffect(() => {
    let active = true;
    getNewApplicationsCount().then((n) => {
      if (active) setNewCount(n);
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-card/50 md:block">
      <div className="p-6">
        <div className="font-heading text-lg font-bold text-foreground">MegaGroup CMS</div>
        <div className="text-xs text-foreground/50">Xaricdə Təhsil</div>
      </div>
      <nav className="px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const isApplications = item.href === "/admin/muraciyyatler";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-brand-primary/20 text-brand-primary"
                  : "text-foreground/70 hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {isApplications && newCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1.5 text-xs font-bold text-white">
                  {newCount > 99 ? "99+" : newCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
