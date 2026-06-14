import React, { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { AppShell } from "@/components/organisms/layout/AppShell";
import { Plus, Target, PiggyBank } from "lucide-react";
import { MilestoneProgress } from "@/components/molecules/MilestoneProgress";
import { ContributionRow } from "@/components/molecules/ContributionRow";
import { CurrencyAmount } from "@/components/atoms/CurrencyAmount";
import { AddContributionModal } from "@/components/modals/AddContributionModal";
import { SetTargetModal } from "@/components/modals/SetTargetModal";
import { MilestoneModal } from "@/components/atoms/MilestoneModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { EmptyState } from "@/components/molecules/EmptyState";
import { IllustrationNoSavings } from "@/components/atoms/illustrations/IllustrationNoSavings";

export default function Overview({
    fund,
    summary,
    contributions,
    couple,
    milestones_reached,
}: any) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [contributionToDelete, setContributionToDelete] = useState<any | null>(null);
    const [contributionToEdit, setContributionToEdit] = useState<any | null>(null);

    // Milestone celebration logic
    const [celebrationMilestone, setCelebrationMilestone] = useState<
        number | null
    >(null);

    useEffect(() => {
        // If we just hit a new milestone (passed via flash data or props), show the celebration
        if (milestones_reached && milestones_reached.length > 0) {
            // Pick the highest milestone reached this request
            const highest = Math.max(...milestones_reached);
            setCelebrationMilestone(highest);
        } else if (
            flash?.milestones_reached &&
            flash.milestones_reached.length > 0
        ) {
            const highest = Math.max(...flash.milestones_reached);
            setCelebrationMilestone(highest);
        }
    }, [milestones_reached, flash]);

    const handleDelete = () => {
        if (!contributionToDelete) return;
        router.delete(
            route("savings.contributions.destroy", contributionToDelete.id),
            {
                preserveScroll: true,
                onSuccess: () => setContributionToDelete(null),
            },
        );
    };

    return (
        <AppShell
            title="Savings Fund"
            coupleName={couple.name}
            userName={user.display_name}
            userAvatar={user.avatar_url}
        >
            {/* Header Tabs */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 space-x-6 overflow-x-auto">
                <div className="pb-3 text-sm font-medium text-pink-600 border-b-2 border-pink-500 whitespace-nowrap">
                    Overview
                </div>
                <Link
                    href={route("savings.goals.index")}
                    className="pb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:text-neutral-200 whitespace-nowrap"
                >
                    Goals
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        Tabungan Pernikahan
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                        Pantau kemajuan dana utama kalian bersama.
                    </p>
                </div>
            </div>

            {/* Main Fund Progress Card */}
            <div className="bg-white dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 mb-8">
                {fund?.target_amount_cents ? (
                    <>
                        <MilestoneProgress
                            progressPct={summary.progress_pct}
                            totalCents={summary.total_saved_cents}
                            targetCents={summary.target_cents}
                            currencyCode={couple.currency_code}
                        />

                        {summary.projected_completion_date &&
                            summary.progress_pct < 100 && (
                                <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl flex items-start space-x-3 text-sm">
                                    <Target className="w-5 h-5 text-neutral-400 shrink-0" />
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        Based on your current saving speed,
                                        you're projected to hit your target by{" "}
                                        <strong className="text-neutral-900 dark:text-neutral-100">
                                            {summary.projected_completion_date}
                                        </strong>
                                        .
                                    </p>
                                </div>
                            )}
                    </>
                ) : (
                    <div className="text-center py-6">
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            Set a savings target!
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm max-w-sm mx-auto">
                            Setting a target unlocks progress tracking,
                            milestone celebrations, and completion estimates.
                        </p>
                        <button
                            onClick={() => setIsTargetModalOpen(true)}
                            className="px-6 py-2 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-pink-sm"
                        >
                            + Set a Target
                        </button>
                    </div>
                )}

                {/* Kontribusi Breakdown & Action */}
                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center overflow-hidden shrink-0">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="You"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-pink-600 font-bold text-sm">
                                        {user.display_name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    You
                                </span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    <CurrencyAmount
                                        cents={summary.my_contribution_cents}
                                        currencyCode={couple.currency_code}
                                    />{" "}
                                    ({summary.my_contribution_pct}%)
                                </span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-neutral-200" />

                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                                {couple.partner_a.id === user.id ? (
                                    couple.partner_b.avatar_url ? (
                                        <img
                                            src={couple.partner_b.avatar_url}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-neutral-500 dark:text-neutral-400 font-bold text-sm">
                                            {couple.partner_b.display_name.charAt(
                                                0,
                                            )}
                                        </span>
                                    )
                                ) : couple.partner_a.avatar_url ? (
                                    <img
                                        src={couple.partner_a.avatar_url}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-neutral-500 dark:text-neutral-400 font-bold text-sm">
                                        {couple.partner_a.display_name.charAt(
                                            0,
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    {couple.partner_a.id === user.id
                                        ? couple.partner_b.display_name
                                        : couple.partner_a.display_name}
                                </span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                    <CurrencyAmount
                                        cents={
                                            summary.partner_contribution_cents
                                        }
                                        currencyCode={couple.currency_code}
                                    />{" "}
                                    ({summary.partner_contribution_pct}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-pink-sm"
                    >
                        <PiggyBank className="w-5 h-5 mr-2" />
                        Add Contribution
                    </button>
                </div>
            </div>

            {/* Recent Kontribusi */}
            <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Recent Kontribusi
                </h3>

                <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-4 sm:p-6">
                    {contributions.length === 0 ? (
                        <EmptyState
                            illustration={<IllustrationNoSavings />}
                            title="Start saving together"
                            description="Make your first contribution to your wedding fund."
                            action={{
                                label: "Add Contribution",
                                onClick: () => setIsAddModalOpen(true),
                            }}
                        />
                    ) : (
                        <div className="divide-y divide-neutral-50">
                            {contributions.map((contribution: any) => (
                                <ContributionRow
                                    key={contribution.id}
                                    contribution={contribution}
                                    currencyCode={couple.currency_code}
                                    canDelete={contribution.is_mine}
                                    onDelete={(c) => {
                                        setContributionToDelete(c);
                                    }}
                                    onEdit={(c) => {
                                        setContributionToEdit(c);
                                        setIsAddModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AddContributionModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setContributionToEdit(null);
                }}
                currencyCode={couple.currency_code}
                userName={user.display_name}
                userAvatar={user.avatar_url}
                currentProgressPct={summary.progress_pct}
                targetCents={summary.target_cents}
                contributionToEdit={contributionToEdit}
            />

            <SetTargetModal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                currencyCode={couple.currency_code}
                currentTargetCents={fund?.target_amount_cents}
            />

            <ConfirmDeleteModal
                isOpen={!!contributionToDelete}
                onClose={() => setContributionToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Contribution"
                description="Are you sure you want to delete this contribution? Your savings progress will be reduced."
            />

            {celebrationMilestone && (
                <MilestoneModal
                    milestone={celebrationMilestone}
                    totalCents={summary.total_saved_cents}
                    currencyCode={couple.currency_code}
                    onClose={() => setCelebrationMilestone(null)}
                />
            )}
        </AppShell>
    );
}
