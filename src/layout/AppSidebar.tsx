"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/context/AuthContext"; // Pastikan path ini benar
import {
  BoxCubeIcon,
  CallIcon,
  CartIcon,
  ChatIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  MailIcon,
  PieChartIcon,
  PlugInIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons/index";

// --- TIPE DATA ---
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  new?: boolean;
  pro?: boolean;
};

type SidebarGroup = {
  name: string; // Nama Group (Menu, Configuration, Support, dll)
  items: NavItem[];
};

// --- 1. DATA MENU UNTUK SUPER ADMIN (Role ID: 1) ---
const SUPER_ADMIN_MENU: SidebarGroup[] = [
  {
    name: "Menu",
    items: [
      {
        icon: <GridIcon />,
        name: "Home",
        path: "/",
      },
      {
        icon: <BoxCubeIcon />,
        name: "Merchants",
        path: "/merchant",
      },
      {
        icon: <ListIcon />,
        name: "Categories",
        subItems: [
          { name: "Overview", path: "/category/overview" },
          { name: "List", path: "/category/list" },
        ],
      },
      {
        icon: <TaskIcon />,
        name: "Products",
        subItems: [
          { name: "Overview", path: "/product/overview" },
          { name: "List", path: "/product/list" },
        ],
      },
      {
        icon: <CartIcon />,
        name: "Orders",
        subItems: [
          { name: "Overview", path: "/orders/overview" },
          { name: "List", path: "/orders/list" },
        ],
      },
      {
        icon: <CartIcon />,
        name: "Invoices",
        subItems: [
          { name: "Overview", path: "/invoices/overview" },
          { name: "List", path: "/invoices/list" },
        ],
      },
      {
        icon: <TaskIcon />,
        name: "Shifting History",
        subItems: [
          { name: "Overview", path: "/shifting-history/overview" },
          { name: "List", path: "/shifting-history/list" },
        ],
      },
      {
        icon: <UserCircleIcon />,
        name: "Users",
        path: "/users",
      },
    ],
  },
  {
    name: "Configuration",
    items: [
      {
        icon: <ChatIcon />,
        name: "Access",
        path: "/access",
      },
      {
        icon: <CallIcon />,
        name: "Role",
        new: true,
        subItems: [
          { name: "Role", path: "/role/list" },
          { name: "Role Access", path: "/role/access" },
        ],
      },
    ],
  },
  {
    name: "Others",
    items: [
      {
        icon: <PlugInIcon />,
        name: "Authentication",
        subItems: [
          { name: "Sign In", path: "/signin", pro: false },
          { name: "Sign Up", path: "/signup", pro: false },
          { name: "Reset Password", path: "/reset-password" },
        ],
      },
    ],
  },
];

// --- 2. HELPER: MAPPING MENU STRING KE COMPONENT ---
function getMenuItemClient(menuKey: string): NavItem | null {
  switch (menuKey) {
    case 'home':
      return {
        icon: <GridIcon />,
        name: "Home",
        path: "/",
      };
    case 'category':
      return {
        icon: <ListIcon />,
        name: "Categories",
        subItems: [
          { name: "Overview", path: "/category/overview" },
          { name: "List", path: "/category/list" },
        ],
      };
    case 'product':
      return {
        icon: <TaskIcon />,
        name: "Products",
        subItems: [
          { name: "Overview", path: "/product/overview" },
          { name: "List", path: "/product/list" },
        ],
      };
    case 'order':
      return {
        icon: <CartIcon />,
        name: "Orders",
        subItems: [
          { name: "Overview", path: "/orders/overview" },
          { name: "List", path: "/orders/list" },
        ],
      };
    case 'invoice':
      return {
        icon: <CartIcon />,
        name: "Invoices",
        subItems: [
          { name: "Overview", path: "/invoices/overview" },
          { name: "List", path: "/invoices/list" },
        ],
      };
    case 'shifting-history':
      return {
        icon: <TaskIcon />,
        name: "Shifting History",
        subItems: [
          { name: "Overview", path: "/shifting-history/overview" },
          { name: "List", path: "/shifting-history/list" },
        ],
      };
    case 'user':
      return {
        icon: <UserCircleIcon />,
        name: "Users",
        path: "/users",
      };
    case 'access':
      return {
        icon: <ChatIcon />,
        name: "Access",
        path: "/access",
      };
    case 'role':
      return {
        icon: <CallIcon />,
        name: "Role",
        new: true,
        subItems: [
          { name: "Role", path: "/role/list" },
          { name: "Role Access", path: "/role/access" },
        ],
      };
    default:
      return null;
  }
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { profile } = useAuth(); // Ambil profile dari Context
  const pathname = usePathname();

  // State untuk data sidebar dinamis
  const [sidebarMenu, setSidebarMenu] = useState<SidebarGroup[]>([]);

  // State untuk melacak submenu mana yang terbuka
  const [openSubmenu, setOpenSubmenu] = useState<{
    groupIndex: number;
    itemIndex: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // 1. Logic Pembuatan Menu Berdasarkan Role
  useEffect(() => {
    if (!profile || !profile.role) return;

    let generatedMenu: SidebarGroup[] = [];

    // Jika Role ID 1 (Super Admin), gunakan menu statis lengkap
    if (profile.role.id === 1) {
      generatedMenu = SUPER_ADMIN_MENU;
    } else {
      // Untuk role lain (misal: Owner, Employee), generate berdasarkan 'access'
      const accessItems: NavItem[] = [];

      // Tambahkan Home secara default jika diperlukan
      const homeItem = getMenuItemClient('home');
      if (homeItem) accessItems.push(homeItem);

      if (profile.role.access && Array.isArray(profile.role.access)) {
        profile.role.access.forEach((access: any) => {
          const item = getMenuItemClient(access.menu);
          if (item) {
            accessItems.push(item);
          }
        });
      }

      // Masukkan item-item tersebut ke dalam grup "Menu"
      if (accessItems.length > 0) {
        generatedMenu.push({
          name: "Menu",
          items: accessItems
        });
      }
    }

    setSidebarMenu(generatedMenu);
  }, [profile]); // Jalankan ulang jika profile berubah

  // 2. Logic Buka Submenu Otomatis (Sama seperti sebelumnya)
  useEffect(() => {
    if (sidebarMenu.length === 0) return;

    let submenuMatched = false;

    sidebarMenu.forEach((group, groupIndex) => {
      group.items.forEach((item, itemIndex) => {
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ groupIndex, itemIndex });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // Opsional: Reset jika tidak ada yang match (misal pindah ke halaman root)
    // if (!submenuMatched) setOpenSubmenu(null); 
  }, [pathname, isActive, sidebarMenu]);

  // Logic Tinggi Submenu
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.groupIndex}-${openSubmenu.itemIndex}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (groupIndex: number, itemIndex: number) => {
    setOpenSubmenu((prev) => {
      if (prev && prev.groupIndex === groupIndex && prev.itemIndex === itemIndex) {
        return null;
      }
      return { groupIndex, itemIndex };
    });
  };

  const renderMenuItems = (items: NavItem[], groupIndex: number) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, itemIndex) => {
        const isSubmenuOpen = openSubmenu?.groupIndex === groupIndex && openSubmenu?.itemIndex === itemIndex;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(groupIndex, itemIndex)}
                className={`menu-item group ${isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"} 
                  cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className={`${isSubmenuOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}

                {nav.new && (isExpanded || isHovered || isMobileOpen) && (
                  <span className={`ml-auto absolute right-10 ${isSubmenuOpen ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
                    new
                  </span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180 text-brand-500" : ""}`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${groupIndex}-${itemIndex}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen ? `${subMenuHeight[`${groupIndex}-${itemIndex}`]}px` : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}>
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-pro-active" : "menu-dropdown-badge-pro-inactive"} menu-dropdown-badge-pro`}>
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col xl:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        xl:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo-pos.png" alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.png" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">

            {sidebarMenu.length > 0 ? (
              sidebarMenu.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h2 className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
                    {isExpanded || isHovered || isMobileOpen ? group.name : <HorizontaLDots />}
                  </h2>
                  {renderMenuItems(group.items, groupIndex)}
                </div>
              ))
            ) : (
              <div className="px-4 text-sm text-gray-400">Loading menu...</div>
            )}

          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;