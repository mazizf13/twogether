<?php

namespace App\Data;

use App\Models\PersonalIncome;
use App\Enums\IncomeSource;

class PersonalIncomeResource
{
    public static function make(PersonalIncome $income): array
    {
        return [
            'id'                        => $income->id,
            'uuid'                      => $income->uuid,
            'amount_cents'              => $income->amount_cents,
            'currency_code'             => $income->currency_code,
            'formatted_amount'          => self::formatCurrency($income->amount_cents, $income->currency_code),
            'source'                    => $income->source,
            'source_label'              => IncomeSource::SOURCES[$income->source] ?? $income->source,
            'description'               => $income->description,
            'income_date'               => $income->income_date->format('Y-m-d'),
            'income_date_formatted'     => $income->income_date->translatedFormat('d M Y'),
            'is_recurring'              => $income->is_recurring,
            'recurring_frequency'       => $income->recurring_frequency,
            'recurring_frequency_label' => $income->recurring_frequency
                ? (IncomeSource::FREQUENCIES[$income->recurring_frequency] ?? $income->recurring_frequency)
                : null,
            'monthly_equivalent_cents'  => self::calculateMonthlyEquivalent($income),
            'is_visible_to_partner'     => $income->is_visible_to_partner,
        ];
    }

    private static function formatCurrency(int $amountCents, string $currencyCode): string
    {
        $value = $amountCents / 100;
        
        $locale = strtoupper($currencyCode) === 'IDR' ? 'id-ID' : 'en-US';
        
        $formatter = new \NumberFormatter($locale, \NumberFormatter::CURRENCY);
        
        if (strtoupper($currencyCode) === 'IDR') {
            $formatter->setAttribute(\NumberFormatter::FRACTION_DIGITS, 0);
        }
        
        return $formatter->formatCurrency($value, $currencyCode);
    }

    private static function calculateMonthlyEquivalent(PersonalIncome $income): ?int
    {
        if (!$income->is_recurring || !$income->recurring_frequency) {
            return null;
        }

        return match ($income->recurring_frequency) {
            'weekly' => (int) round($income->amount_cents * 4.33),
            'biweekly' => (int) round($income->amount_cents * 2.17),
            'monthly' => $income->amount_cents,
            'quarterly' => (int) round($income->amount_cents / 3),
            'yearly' => (int) round($income->amount_cents / 12),
            default => null,
        };
    }
}
