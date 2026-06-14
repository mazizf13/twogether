import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    PiggyBank,
    Heart,
    TrendingUp,
    ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Home", routeName: "dashboard", icon: LayoutDashboard },
    { label: "Keuangan", routeName: "expenses.personal", icon: ArrowLeftRight },
    { label: "Analitik", routeName: "analytics", icon: TrendingUp },
    { label: "Tabungan", routeName: "savings.index", icon: PiggyBank },
    { label: "Pernikahan", routeName: "wedding", icon: Heart },
];

export function BottomNav() {
    const { url } = usePage();

    const isAktif = (routeName: string) => {
        if (routeName === "dashboard" && url === "/dashboard") return true;
        if (
            routeName !== "dashboard" &&
            url.startsWith("/" + routeName.split(".")[0])
        )
            return true;
        return false;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 lg:hidden z-40 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isAktif(item.routeName);

                    return (
                        <Link
                            key={item.label}
                            href={route(item.routeName)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200",
                                active
                                    ? "text-pink-600 scale-105"
                                    : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-300",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6",
                                    active && "fill-pink-50 text-pink-600",
                                )}
                            />
                            <span
                                className={cn(
                                    "text-[10px] font-medium",
                                    active && "font-bold",
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
