
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
