import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { AppShell } from "@/components/organisms/layout/AppShell";
import { FinancialSummary, IncomeBySource, PersonalIncome } from "@/types";
import {
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ComposedChart,
} from "recharts";
import { cn } from "@/lib/utils";
import { format, parse, subMonths, isAfter, startOfMonth } from "date-fns";
import { id } from "date-fns/locale";

interface AnalyticsProps {
    current_month: FinancialSummary;
    previous_month: FinancialSummary;
    trend: FinancialSummary[];
    income_by_source: IncomeBySource[];
    expense_by_category: any[];
    shared_by_category: any[];
    recurring_incomes: PersonalIncome[];
    selected_month: string;
    couple: {
        name: string;
        currency_code: string;
    };
    currency_code: string;
}

const CHART_COLORS = {
    income: "#f472b6", // pink-400
    expense: "#d4d4d8", // neutral-300
    shared: "#fb7185", // rose-400
    cashflow_positive: "#16a34a", // green-600
    cashflow_negative: "#dc2626", // red-600
};

const SOURCE_COLORS = [
    "#f472b6", // pink-400
    "#fb7185", // rose-400
    "#fbcfe8", // pink-200
    "#db2777", // pink-600
    "#f9a8d4", // pink-300
    "#fce7f3", // pink-100
    "#be185d", // pink-700
    "#a8a29e", // neutral-400
];

export default function AnalyticsPage({
    current_month,
    trend,
    income_by_source,
    expense_by_category,
    shared_by_category,
    recurring_incomes,
    selected_month,
    couple,
    currency_code,
}: AnalyticsProps) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const formatCurrency = (cents: number, compact = false) => {
        return new Intl.NumberFormat(
            currency_code === "IDR" ? "id-ID" : "en-US",
            {
                style: "currency",
                currency: currency_code,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                notation: compact ? "compact" : "standard",
            },
        ).format(cents / 100);
    };

    const handleMonthChange = (offset: number) => {
        const current = parse(selected_month, "yyyy-MM", new Date());
        const newDate = subMonths(current, offset * -1); // -1 offset = prev month
        router.get(
            route("analytics"),
            { month: format(newDate, "yyyy-MM") },
            { preserveScroll: true },
        );
    };

    const currentParsedDate = parse(selected_month, "yyyy-MM", new Date());
    const canGoNext = !isAfter(
        currentParsedDate,
        startOfMonth(subMonths(new Date(), 1)),
    );

    // Format trend data for recharts
    const trendData = trend.map((item) => ({
        name: parse(item.month, "yyyy-MM", new Date()).toLocaleDateString(
            "id-ID",
            { month: "short" },
        ),
        Pemasukan: item.total_income_cents / 100,
        Pengeluaran:
            (item.total_expenses_cents + item.shared_share_cents) / 100,
        Cashflow: item.net_cashflow_cents / 100,
    }));

    const expenseData = expense_by_category
        .map((item) => ({
            name: item.category,
            amount: item.total_cents / 100,
            type: item.type,
        }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <AppShell
            title="Analitik"
            coupleName={couple.name}
            userName={user.display_name}
            userAvatar={user.avatar_url}
        >
            <Head title="Analitik Keuangan - Twogether" />

            <div className="flex flex-col space-y-6 md:space-y-8 pb-10">
                {/* Header & Month Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Analitik Keuangan
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Pantau arus kas dan tren keuanganmu di sini.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 bg-white dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm w-fit">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMonthChange(-1)}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 min-w-[120px] text-center">
                            {format(currentParsedDate, "MMMM yyyy", {
                                locale: id,
                            })}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMonthChange(1)}
                            disabled={!canGoNext}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* SECTION 1: Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Total Pemasukan
                        </span>
                        <div className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(current_month.total_income_cents)}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Pengeluaran Pribadi
                        </span>
                        <div className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(current_month.total_expenses_cents)}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5">
                        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Bagian Bersama
                        </span>
                        <div className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(current_month.shared_share_cents)}
                        </div>
                    </div>
                    <div
                        className={cn(
                            "rounded-2xl border shadow-sm p-5",
                            current_month.net_cashflow_cents >= 0
                                ? "bg-green-50 border-green-100"
                                : "bg-red-50 border-red-100",
                        )}
                    >
                        <span
                            className={cn(
                                "text-sm font-medium",
                                current_month.net_cashflow_cents >= 0
                                    ? "text-green-700"
                                    : "text-red-700",
                            )}
                        >
                            Net Cashflow
                        </span>
                        <div
                            className={cn(
                                "mt-2 text-2xl font-bold flex items-center",
                                current_month.net_cashflow_cents >= 0
                                    ? "text-green-700"
                                    : "text-red-700",
                            )}
                        >
                            {current_month.net_cashflow_cents > 0 ? (
                                <TrendingUp className="w-5 h-5 mr-2" />
                            ) : current_month.net_cashflow_cents < 0 ? (
                                <TrendingDown className="w-5 h-5 mr-2" />
                            ) : (
                                <Minus className="w-5 h-5 mr-2" />
                            )}
                            {formatCurrency(current_month.net_cashflow_cents)}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Income vs Expense Bar Chart */}
                <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                        Pemasukan vs Pengeluaran — 6 Bulan Terakhir
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={trendData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e4e4e7"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#71717a" }}
                                />
                                <YAxis
                                    tickFormatter={(val) =>
                                        formatCurrency(val * 100, true)
                                    }
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#71717a" }}
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        formatCurrency(value * 100)
                                    }
                                    cursor={{ fill: "#f4f4f5" }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="Pemasukan"
                                    fill={CHART_COLORS.income}
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="Pengeluaran"
                                    fill={CHART_COLORS.expense}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SECTION 3: Income Source & Expense Category */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut Chart: Income by Source */}
                    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                            Sumber Pemasukan
                        </h2>
                        {income_by_source.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-neutral-400">
                                Belum ada data pemasukan bulan ini
                            </div>
                        ) : (
                            <div className="h-[300px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={income_by_source}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={2}
                                            dataKey="total_cents"
                                        >
                                            {income_by_source.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            SOURCE_COLORS[
                                                                index %
                                                                    SOURCE_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) =>
                                                formatCurrency(value)
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                        Total Pemasukan
                                    </span>
                                    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                                        {formatCurrency(
                                            current_month.total_income_cents,
                                            true,
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="mt-4 space-y-2">
                            {income_by_source.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{
                                                backgroundColor:
                                                    SOURCE_COLORS[
                                                        i % SOURCE_COLORS.length
                                                    ],
                                            }}
                                        />
                                        <span className="text-neutral-600 dark:text-neutral-300">
                                            {item.source_label}
                                        </span>
                                    </div>
                                    <div className="flex space-x-4">
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                            {formatCurrency(item.total_cents)}
                                        </span>
                                        <span className="text-neutral-400 w-12 text-right">
                                            {Math.round(
                                                (item.total_cents /
                                                    current_month.total_income_cents) *
                                                    100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Donut Chart: Expense Category */}
                    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                            Pengeluaran per Kategori
                        </h2>
                        {expenseData.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-neutral-400">
                                Belum ada pengeluaran bulan ini
                            </div>
                        ) : (
                            <div className="h-[300px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expenseData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={2}
                                            dataKey="amount"
                                        >
                                            {expenseData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        SOURCE_COLORS[
                                                            index % SOURCE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) =>
                                                formatCurrency(value * 100)
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                        Total Pengeluaran
                                    </span>
                                    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                                        {formatCurrency(
                                            current_month.total_expenses_cents + current_month.shared_share_cents,
                                            true,
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="mt-4 space-y-2">
                            {expenseData.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{
                                                backgroundColor:
                                                    SOURCE_COLORS[
                                                        i % SOURCE_COLORS.length
                                                    ],
                                            }}
                                        />
                                        <span className="text-neutral-600 dark:text-neutral-300">
                                            {item.name}
                                        </span>
                                        <span className="ml-2 text-[10px] uppercase font-bold text-neutral-400 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                                            {item.type}
                                        </span>
                                    </div>
                                    <div className="flex space-x-4">
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                            {formatCurrency(item.amount * 100)}
                                        </span>
                                        <span className="text-neutral-400 w-12 text-right">
                                            {Math.round(
                                                ((item.amount * 100) /
                                                    (current_month.total_expenses_cents + current_month.shared_share_cents)) *
                                                    100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 4 & 5: Cashflow Trend and Recurring Incomes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                            Tren Arus Kas 6 Bulan
                        </h2>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={trendData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e4e4e7"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#71717a" }}
                                    />
                                    <YAxis
                                        tickFormatter={(val) =>
                                            formatCurrency(val * 100, true)
                                        }
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#71717a" }}
                                    />
                                    <Tooltip
                                        formatter={(value: number) =>
                                            formatCurrency(value * 100)
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Cashflow"
                                        stroke={CHART_COLORS.income}
                                        strokeWidth={3}
                                        dot={(props: any) => {
                                            const { cx, cy, payload } = props;
                                            const isPositive =
                                                payload.Cashflow >= 0;
                                            return (
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={4}
                                                    fill={
                                                        isPositive
                                                            ? CHART_COLORS.cashflow_positive
                                                            : CHART_COLORS.cashflow_negative
                                                    }
                                                    stroke="white"
                                                    strokeWidth={2}
                                                />
                                            );
                                        }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {recurring_incomes.length > 0 && (
                        <div className="bg-pink-50 rounded-2xl border border-pink-100 p-6 flex flex-col justify-center">
                            <div className="bg-white dark:bg-neutral-950 rounded-xl p-4 shadow-sm">
                                <h3 className="font-bold text-pink-900 flex items-center mb-4">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Pemasukan Rutin
                                </h3>
                                <div className="space-y-4">
                                    {recurring_incomes.map((inc) => (
                                        <div
                                            key={inc.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                                    {inc.source_label}
                                                </p>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {
                                                        inc.recurring_frequency_label
                                                    }
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-pink-600">
                                                    {inc.formatted_amount}
                                                </p>
                                                {inc.monthly_equivalent_cents &&
                                                    inc.recurring_frequency !==
                                                        "monthly" && (
                                                        <p className="text-xs text-neutral-400">
                                                            ≈{" "}
                                                            {formatCurrency(
                                                                inc.monthly_equivalent_cents,
                                                            )}
                                                            /bln
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center leading-relaxed">
                                        💡 Pemasukanmu yang rutin mencapai{" "}
                                        <strong className="text-neutral-900 dark:text-neutral-100 font-bold">
                                            {formatCurrency(
                                                recurring_incomes.reduce(
                                                    (acc, curr) =>
                                                        acc +
                                                        (curr.monthly_equivalent_cents ||
                                                            curr.amount_cents),
                                                    0,
                                                ),
                                            )}
                                        </strong>{" "}
                                        per bulan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}
