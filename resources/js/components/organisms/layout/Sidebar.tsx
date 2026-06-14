import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    CreditCard,
    PiggyBank,
    Heart,
    Settings,
    LogOut,
    TrendingUp,
    ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    coupleName: string | null;
    userName: string;
    userAvatar?: string | null;
}

const NAV_ITEMS = [
    { label: "Home", routeName: "dashboard", icon: LayoutDashboard },
    { label: "Keuangan", routeName: "expenses.personal", icon: ArrowLeftRight },
    { label: "Analitik", routeName: "analytics", icon: TrendingUp },
    { label: "Tabungan", routeName: "savings.index", icon: PiggyBank },
    { label: "Pernikahan", routeName: "wedding", icon: Heart },
];

export function Sidebar({ coupleName, userName, userAvatar }: SidebarProps) {
    const { url } = usePage();

    const isAktif = (routeName: string) => {
        // Basic prefix matching for active states
        if (routeName === "dashboard" && url === "/dashboard") return true;
        if (
            routeName !== "dashboard" &&
            url.startsWith("/" + routeName.split(".")[0])
        )
            return true;
        return false;
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-neutral-950 border-r border-neutral-100 dark:border-neutral-800 hidden lg:flex flex-col z-40">
            {/* Top Section */}
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold font-serif shrink-0 border-2 border-white shadow-sm">
                    {(coupleName || "Couple").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {coupleName || "Your Couple"}
                    </h2>
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                        Aktif now
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isAktif(item.routeName);

                    return (
                        <Link
                            key={item.label}
                            href={route(item.routeName)}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 border-l-4",
                                active
                                    ? "bg-pink-50 text-pink-600 border-pink-500"
                                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 hover:text-neutral-900 dark:text-neutral-100 border-transparent",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5",
                                    active
                                        ? "text-pink-500"
                                        : "text-neutral-400",
                                )}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center space-x-3 min-w-0">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 dark:text-neutral-300 font-bold text-xs uppercase shrink-0">
                                {userName.charAt(0)}
                            </div>
                        )}
                        <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                            {userName}
                        </span>
                    </div>
                    <Link
                        href={route("settings.profile.show")}
                        className="p-2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:bg-neutral-800 transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                    </Link>
                </div>
                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                </Link>
            </div>
        </aside>
    );
}
