import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  FileEdit, 
  MessageSquare, 
  Users, 
  FileText,
  Settings,
  FileQuestion,
  Megaphone,
  Layers,
  FolderGit2,
  Download,
  BarChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Define navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function MobileAdminNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Define navigation sections
  const navSections = [
    {
      title: t("admin.nav.mainSection"),
      items: [
        { href: "/admin", label: t("admin.nav.dashboard"), icon: <LayoutDashboard className="h-5 w-5" /> },
        { href: "/admin/products", label: t("admin.nav.products"), icon: <Package className="h-5 w-5" /> },
        { href: "/admin/pages", label: t("admin.nav.pages"), icon: <FileEdit className="h-5 w-5" /> },
        { href: "/admin/content", label: t("admin.nav.content"), icon: <FileText className="h-5 w-5" /> },
        { href: "/admin/projects", label: t("admin.nav.projects"), icon: <FolderGit2 className="h-5 w-5" /> },
      ]
    },
    {
      title: t("admin.nav.crmSection"),
      items: [
        { href: "/admin/contact", label: t("admin.nav.contacts"), icon: <MessageSquare className="h-5 w-5" /> },
        { href: "/admin/quotes", label: t("admin.nav.quotes"), icon: <FileQuestion className="h-5 w-5" /> },
        { href: "/admin/clients", label: t("admin.nav.clients"), icon: <Users className="h-5 w-5" /> },
      ]
    },
    {
      title: t("admin.nav.toolsSection"),
      items: [
        { href: "/admin/documents", label: t("admin.nav.documents"), icon: <Download className="h-5 w-5" /> },
        { href: "/admin/marketing", label: t("admin.nav.marketing"), icon: <Megaphone className="h-5 w-5" /> },
        { href: "/admin/templates", label: t("admin.nav.templates"), icon: <Layers className="h-5 w-5" /> },
        { href: "/admin/analytics", label: t("admin.nav.analytics"), icon: <BarChart className="h-5 w-5" /> },
      ]
    },
    {
      title: t("admin.nav.systemSection"),
      items: [
        { href: "/admin/settings", label: t("admin.nav.settings"), icon: <Settings className="h-5 w-5" /> },
      ]
    }
  ];

  // Function to check if a navigation item is active
  const isActive = (href: string) => {
    if (href === "/admin" && location === "/admin") {
      return true;
    }
    return href !== "/admin" && location.startsWith(href);
  };

  // Render a navigation section
  const renderNavSection = (section: { title: string; items: NavItem[] }, index: number) => (
    <div key={index} className="mb-6">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {section.title}
      </h3>
      <ul className="space-y-1">
        {section.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <Link href={item.href}>
              <a
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold text-lg">MetaNord Admin</div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3">
              {navSections.map(renderNavSection)}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}