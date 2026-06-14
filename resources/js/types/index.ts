export interface User {
  id: number;
  uuid: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  couple_id: number | null;
}

export interface PartnerSummary {
  id: number;
  display_name: string;
  avatar_url: string | null;
}

export interface Couple {
  id: number;
  uuid: string;
  name: string;
  partner_a: PartnerSummary;
  partner_b: PartnerSummary | null;
  wedding_date: string | null;
  currency_code: string;
  status: 'pending' | 'active' | 'dissolved';
}

export interface Money {
  amount_cents: number;
  currency_code: string;
  formatted: string;
}

export interface SharedProps {
  auth: {
    user: User | null;
    couple: Couple | null;
  };
  flash: {
    success?: string;
    error?: string;
  };
  errors: Record<string, string>;
}

export type IncomeSource =
  | 'salary' | 'freelance' | 'business' | 'investment'
  | 'rental' | 'bonus' | 'gift' | 'other';

export type RecurringFrequency =
  | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface PersonalIncome {
    id: number;
    uuid: string;
    amount_cents: number;
    currency_code: string;
    formatted_amount: string;
    source: IncomeSource;
    source_label: string;
    description: string | null;
    income_date: string;
    income_date_formatted: string;
    is_recurring: boolean;
    recurring_frequency: RecurringFrequency | null;
    recurring_frequency_label: string | null;
    monthly_equivalent_cents: number | null;
    is_visible_to_partner: boolean;
}

export interface MonthlySummary {
    month: string;
    month_label: string;
    total_income_cents: number;
    total_expenses_cents: number;
    shared_share_cents: number;
    total_outflow_cents: number;
    net_cashflow_cents: number;
    savings_rate_pct: number;
}

export interface FinancialSummary {
    total_income_this_month_cents: number;
    total_expenses_this_month_cents: number;
    shared_share_this_month_cents: number;
    net_cashflow_cents: number;
    savings_rate_pct: number;
    vs_last_month_pct: number;
}

export interface IncomeBySource {
    source: string;
    source_label: string;
    total_cents: number;
    count: number;
}

