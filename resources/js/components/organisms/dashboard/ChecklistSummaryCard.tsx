import React from "react";
import { Link } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";

interface ChecklistSummaryProps {
    total: number;
    completed: number;
    terlewat: number;
    pct: number;
}

export function ChecklistSummaryCard({
    total,
    completed,
    terlewat,
    pct,
}: ChecklistSummaryProps) {
    // SVG Donut calculation
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return (
        <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col h-full items-center justify-center text-center">
            <div className="w-full flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Checklist Wedding
                </h3>
                <Link
                    href={route("wedding")}
                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                    Lihat semua &rarr;
                </Link>
            </div>

            <div className="relative w-32 h-32 mb-4">
                <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                >
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-neutral-100"
                    />
                    {/* Progress circle */}
                    {total > 0 && (
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-pink-500 transition-all duration-1000 ease-out"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {total > 0 ? pct : 0}%
                    </span>
                </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                {total > 0 ? (
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {completed}
                    </span>
                ) : (
                    0
                )}{" "}
                of {total} tasks done
            </p>

            {terlewat > 0 && (
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{terlewat} terlewat</span>
                </div>
            )}

            {total === 0 && (
                <div className="text-xs text-neutral-400">
                    No tasks added yet
                </div>
            )}
        </div>
    );
}
