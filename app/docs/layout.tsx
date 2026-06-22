import type { ReactNode } from "react";
import { Sidebar } from "@/components/docs/sidebar";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { TopNav } from "@/components/docs/top-nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6">
    
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="scroll-rail sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-2">
            <Sidebar />
          </div>
        </aside>

       
        <main className="min-w-0 flex-1 py-10">{children}</main>

       
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="scroll-rail sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
