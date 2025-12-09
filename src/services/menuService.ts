// import { useAuth } from "@/context/AuthContext";
// import { SidebarGroup, NavItem } from "@/types/navbar/nav_item";
// import {
//     BoxCubeIcon,
//     CallIcon,
//     CartIcon,
//     ChatIcon,
//     ChevronDownIcon,
//     GridIcon,
//     HorizontaLDots,
//     ListIcon,
//     MailIcon,
//     PieChartIcon,
//     PlugInIcon,
//     TaskIcon,
//     UserCircleIcon,
// } from "../icons/index";

// export function getMenuSidebar(): SidebarGroup[] {
//     const { profile } = useAuth();
//     let menu: SidebarGroup[] = [];
//     switch (profile?.role.id) {
//         case 1:
//             menu = [
//                 {
//                     name: "Menu",
//                     items: [
//                         {
//                             icon: <GridIcon />,
//                     name: "Home",
//                             path: "/",
//                         },
//                         {
//                             icon: <BoxCubeIcon />,
//                     name: "Merchants",
//                             path: "/merchant",
//                         },
//                         {
//                             icon: <ListIcon />,
//                     name: "Categories",
//                             subItems: [
//                                 { name: "Overview", path: "/category/overview" },
//                                 { name: "List", path: "/category/list" },
//                             ],
//                         },
//                         {
//                             icon: <TaskIcon />,
//                     name: "Products",
//                             subItems: [
//                                 { name: "Overview", path: "/product/overview" },
//                                 { name: "List", path: "/product/list" },
//                             ],
//                         },
//                         {
//                             icon: <CartIcon />,
//                     name: "Orders",
//                             subItems: [
//                                 { name: "Overview", path: "/orders/overview" },
//                                 { name: "List", path: "/orders/list" },
//                             ],
//                         },
//                         {
//                             icon: <CartIcon />,
//                     name: "Invoices",
//                             subItems: [
//                                 { name: "Overview", path: "/invoices/overview" },
//                                 { name: "List", path: "/invoices/list" },
//                             ],
//                         },
//                         {
//                             icon: <TaskIcon />,
//                     name: "Shifting History",
//                             subItems: [
//                                 { name: "Overview", path: "/shifting-history/overview" },
//                                 { name: "List", path: "/shifting-history/list" },
//                             ],
//                         },
//                         {
//                             icon: <UserCircleIcon />,
//                     name: "Users",
//                             path: "/users",
//                         },
//                     ],
//                 },
//                 {
//                     name: "Configuration",
//                     items: [
//                         {
//                             icon: <ChatIcon />,
//                     name: "Access",
//                             path: "/access",
//                         },
//                         {
//                             icon: <CallIcon />,
//                     name: "Role",
//                             new: true,
//                             subItems: [
//                                 { name: "Role", path: "/role/list" },
//                                 { name: "Role Access", path: "/role/access" },
//                             ],
//                         },
//                     ],
//                 },
//             ];
//         case 2:
//             for (let index = 0; index < profile.role.access.length; index++) {
//                 menu.push(getMenuItemClient(profile.role.access[index].menu))
//             }
//             return menu
//     }
//     return []
// }

// export function getMenuItemClient(menu: string): NavItem | null {
//     switch (menu) {
//         case 'category':
//             return {
//                 icon: <ListIcon />,
//                 name: "Categories",
//                 subItems: [
//                     { name: "Overview", path: "/category/overview" },
//                     { name: "List", path: "/category/list" },
//                 ],
//             }
//         case 'product':
//             return {
//                 icon: <TaskIcon />,
//                 name: "Products",
//                 subItems: [
//                     { name: "Overview", path: "/product/overview" },
//                     { name: "List", path: "/product/list" },
//                 ],
//             }
//         case 'order':
//             return {
//                 icon: <CartIcon />,
//                 name: "Orders",
//                 subItems: [
//                     { name: "Overview", path: "/orders/overview" },
//                     { name: "List", path: "/orders/list" },
//                 ],
//             }
//         case 'invoice':
//             return {
//                 icon: <CartIcon />,
//                 name: "Invoices",
//                 subItems: [
//                     { name: "Overview", path: "/invoices/overview" },
//                     { name: "List", path: "/invoices/list" },
//                 ],
//             }
//         case 'shifting-history':
//             return {
//                 icon: <TaskIcon />,
//                 name: "Shifting History",
//                 subItems: [
//                     { name: "Overview", path: "/shifting-history/overview" },
//                     { name: "List", path: "/shifting-history/list" },
//                 ],
//             }
//         case 'user':
//             return {
//                 icon: <UserCircleIcon />,
//                 name: "Users",
//                 path: "/users",
//             }
//         case 'access':
//             return {
//                 icon: <ChatIcon />,
//                 name: "Access",
//                 path: "/access",
//             }
//         case 'role': {
//             return {
//                 icon: <CallIcon />,
//                 name: "Role",
//                 new: true,
//                 subItems: [
//                     { name: "Role", path: "/role/list" },
//                     { name: "Role Access", path: "/role/access" },
//                 ],
//             }
//         }
//         default:
//             return null
//     }
// }