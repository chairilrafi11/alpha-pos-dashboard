export type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
    new?: boolean;
    pro?: boolean;
};

export type SidebarGroup = {
    name: string;
    items: NavItem[];
};