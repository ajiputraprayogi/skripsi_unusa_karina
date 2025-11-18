"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
    ChevronDownIcon,
    HorizontaLDots,
    PlugInIcon,
    BoxCubeIcon,
    EnvelopeIcon,
    GridIcon,
    InfoIcon,
    DollarLineIcon,
    UserCircleIcon
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
// Hapus: import { usePermissions } from "@/context/PermissionsContext";
// Hapus: import { hasPermission } from "@/utils/hasPermission";

type SubItem = {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
};

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: SubItem[];
};

// =========================
// Semua nav items (Disesuaikan)
// =========================
const navItems: NavItem[] = [
    // 📝 TAMBAHAN: Menu Kuesioner
    {
        name: "Kuesioner",
        icon: <BoxCubeIcon />,
        subItems: [
            { name: "Manajemen Soal", path: "/backend/questions" },
            { name: "Riwayat Jawaban", path: "/backend/responses" },
        ],
    },
    // ------------------------------------
    // ITEM LAMA (Permission Dihapus)
    // ------------------------------------
    {
        name: "Settings",
        icon: <PlugInIcon />,
        subItems: [
            { name: "Data Users", path: "/backend/users" },
            // Roles dan Permissions DIHAPUS
        ],
    },
];


const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();
    
    // Hapus: const { permissions: userPermissions = [], loading: permissionsLoading } = usePermissions();

    const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback((path: string) => path === pathname, [pathname]);

    // Gunakan semua nav items
    const filteredNavItems = navItems;

    // =======================================================
    // 1. 🐞 FIX: Logika Pembukaan Submenu Otomatis (Ganti yang lama)
    // =======================================================
    useEffect(() => {
        // Cari index submenu yang aktif berdasarkan path saat ini
        const activeIndex = filteredNavItems.findIndex(nav => 
            nav.subItems && nav.subItems.some(sub => isActive(sub.path))
        );

        if (activeIndex !== -1) {
            const menuType: "main" = "main";
            
            // PENGAMAN KRITIS: Hanya panggil setOpenSubmenu jika index submenu saat ini berbeda 
            // atau jika belum ada submenu yang terbuka.
            if (openSubmenu?.type !== menuType || openSubmenu?.index !== activeIndex) {
                setOpenSubmenu({ type: menuType, index: activeIndex });
            }
        } else if (openSubmenu?.type === "main") {
            // Jika tidak ada submenu di menu utama yang aktif, tutup.
            setOpenSubmenu(null);
        }
    // ⚠️ Dependensi KRITIS: Hanya bergantung pada pathname/isActive, BUKAN pada openSubmenu.
    }, [pathname, filteredNavItems, isActive]); 


    // =======================================================
    // 2. Logika Perhitungan Tinggi Submenu (Dipertahankan)
    // =======================================================
    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                // Gunakan requestAnimationFrame untuk memastikan pengukuran dilakukan setelah render
                // Meskipun tidak wajib, ini bisa membantu akurasi pengukuran.
                const updateHeight = () => {
                     setSubMenuHeight(prev => ({
                        ...prev,
                        [key]: subMenuRefs.current[key]?.scrollHeight || 0
                    }));
                };
                
                requestAnimationFrame(updateHeight);
            }
        }
    // ✅ Dependensi hanya openSubmenu.
    }, [openSubmenu]); 


    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu(prev =>
            prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
        );
    };

    const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => {
                // Tentukan apakah submenu ini seharusnya terbuka karena aktif di path
                const isActivePathInSubmenu = nav.subItems?.some(sub => isActive(sub.path)) ?? false;
                
                // Tentukan apakah submenu sedang dibuka oleh user (klik) atau otomatis (path)
                const isSubmenuOpen = (openSubmenu?.type === menuType && openSubmenu?.index === index) || isActivePathInSubmenu;

                return (
                    <li key={nav.name}>
                        {nav.subItems ? (
                            <>
                                <button
                                    onClick={() => handleSubmenuToggle(index, menuType)}
                                    className={`menu-item group ${
                                        isSubmenuOpen // Menggunakan isSubmenuOpen
                                            ? "menu-item-active"
                                            : "menu-item-inactive"
                                    } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                                >
                                    <span className={`${
                                        isSubmenuOpen // Menggunakan isSubmenuOpen
                                            ? "menu-item-icon-active"
                                            : "menu-item-icon-inactive"
                                    }`}>{nav.icon}</span>
                                    {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                                    {(isExpanded || isHovered || isMobileOpen) && (
                                        <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                            isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                                        }`} />
                                    )}
                                </button>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <div
                                        ref={el => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
                                        className="overflow-hidden transition-all duration-300"
                                        style={{ 
                                            // Tinggi dihitung berdasarkan openSubmenu state, atau dipaksa terbuka 
                                            // jika sedang aktif di path, meskipun state openSubmenu = null (dari useEffect 1)
                                            height: isSubmenuOpen 
                                                ? `${subMenuHeight[`${menuType}-${index}`] || 0}px` 
                                                : "0px" 
                                        }}
                                    >
                                        <ul className="mt-2 space-y-1 ml-9">
                                            {nav.subItems.map(sub => (
                                                <li key={sub.name}>
                                                    <Link
                                                        href={sub.path}
                                                        className={`menu-dropdown-item ${
                                                            isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                                                        }`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            nav.path && (
                                <Link
                                    href={nav.path}
                                    className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                                >
                                    <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{nav.icon}</span>
                                    {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                                </Link>
                            )
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
                isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
            } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo */}
            <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                <Link href="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
                            <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
                        </>
                    ) : (
                        <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>

            {/* Menu */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                            }`}>
                                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
                            </h2>

                            {/* Tampilkan Menu */}
                            {filteredNavItems.length > 0 ? renderMenuItems(filteredNavItems, "main") : (
                                <p className="text-sm text-gray-400">No menu available</p>
                            )}
                        </div>
                    </div>
                </nav>
                {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
            </div>
        </aside>
    );
};

export default AppSidebar;