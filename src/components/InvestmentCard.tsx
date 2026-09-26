
// src/components/InvestmentCard.tsx

'use client';

import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Image from 'next/image';

import type { Investment } from '@/src/lib/types/investment';
import { useTranslation } from '../i18n/translations';
import { useSettings } from '@/src/context/useSettings';
import { formatCurrency } from '@/src/lib/utils/currency';

interface InvestmentCardProps {
  investment: Investment;
  onClick?: () => void;
}

export default function InvestmentCard({
  investment,
  onClick,
}: InvestmentCardProps) {
  const { t, language } = useTranslation();
  const { currency } = useSettings();

  const formatAmount = (amount: number) =>
    formatCurrency(amount, currency);

  const formatDate = (
    date: string | null | undefined,
  ) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return new Intl.DateTimeFormat(language, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsedDate);
  };

  const getStatusLabel = () => {
    switch (investment.status) {
      case 'ACTIVE':
        return t('investment.active');

      case 'PENDING':
        return t('investment.pending');

      case 'MATURED':
        return t('investment.matured');

      case 'CANCELLED':
        return t('investment.cancelled');

      case 'WITHDRAWN':
        return t('investment.withdrawn');

      default:
        return investment.status;
    }
  };

  const durationDays =
    investment.durationDays ?? 0;

  const progress = Math.min(
    Math.max(investment.progress, 0),
    100,
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-3xl border border-white/8 bg-[#0B1426] text-left shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-[#101D33] hover:shadow-emerald-950/20 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
    >
      <div className="flex min-h-47.5">
        {/* Image */}
        <div className="relative w-[37%] min-w-31.25 overflow-hidden bg-[#07101F]">
          {investment.image ? (
            <Image
              src={investment.image}
              alt={
                investment.planName ||
                'Investment'
              }
              fill
              sizes="(max-width: 640px) 37vw, 240px"
              loading="lazy"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-emerald-400/10 to-purple-400/5">
              <span
                className="text-3xl opacity-60"
                aria-hidden="true"
              >
                📈
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-[#050B18]/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/60 backdrop-blur-md">
              Investment
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-white">
                {investment.planName ||
                  'Investment'}
              </h3>

              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-300/8 px-2 py-1 text-[9px] font-bold text-emerald-200">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                  aria-hidden="true"
                />

                {getStatusLabel()}
              </span>
            </div>

            <ArrowUpRight
              size={17}
              className="shrink-0 text-white/20 transition group-hover:text-emerald-300"
              aria-hidden="true"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <InfoItem
              label={t('investment.amount')}
              value={formatAmount(
                investment.amount,
              )}
            />

            <InfoItem
              label={t(
                'investment.total_projected',
              )}
              value={formatAmount(
                investment.projectedValue,
              )}
            />

            <InfoItem
              label={t('investment.duration')}
              value={formatDuration(
                durationDays,
                language,
              )}
              icon={<Clock3 size={11} />}
            />

            <InfoItem
              label={t(
                'details.progress_percent',
              )}
              value={`${progress}%`}
            />
          </div>

          <div className="mt-auto pt-3">
            <div className="mb-1.5 flex justify-between text-[9px] text-white/25">
              <span>
                {t(
                  'details.investment_progress',
                )}
              </span>

              <span>{progress}%</span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-white/6"
              role="progressbar"
              aria-label={t(
                'details.investment_progress',
              )}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-300 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[9px] text-white/25">
            <CalendarDays size={11} />

            <span>
              {t('investment.maturity')}{' '}
              {formatDate(
                investment.maturityDate,
              )}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/2.5 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[8px] uppercase tracking-wide text-white/25">
        {icon}
        <span>{label}</span>
      </div>

      <div className="mt-1 truncate text-[11px] font-bold text-white/75">
        {value}
      </div>
    </div>
  );
}

function formatDuration(
  days: number,
  language: string,
): string {
  const safeDays = Math.max(
    0,
    Math.floor(days),
  );

  try {
    const formatter = new Intl.NumberFormat(
      language,
    );

    const normalizedLanguage = language
      .toLowerCase()
      .split('-')[0];

    const singularForms: Record<
      string,
      string
    > = {
      en: 'day',
      es: 'día',
      fr: 'jour',
      pt: 'dia',
      sw: 'siku',
      de: 'Tag',
      it: 'giorno',
      nl: 'dag',
      ar: 'يوم',
      hi: 'दिन',
      zh: '天',
      ja: '日',
      ko: '일',
      tr: 'gün',
      ru: 'день',
      pl: 'dzień',
      id: 'hari',
    };

    const pluralForms: Record<
      string,
      string
    > = {
      en: 'days',
      es: 'días',
      fr: 'jours',
      pt: 'dias',
      sw: 'siku',
      de: 'Tage',
      it: 'giorni',
      nl: 'dagen',
      ar: 'أيام',
      hi: 'दिन',
      zh: '天',
      ja: '日',
      ko: '일',
      tr: 'gün',
      ru: 'дней',
      pl: 'dni',
      id: 'hari',
    };

    const singular =
      singularForms[normalizedLanguage];

    const plural =
      pluralForms[normalizedLanguage];

    if (!singular || !plural) {
      return `${formatter.format(
        safeDays,
      )} days`;
    }

    return `${formatter.format(
      safeDays,
    )} ${
      safeDays === 1
        ? singular
        : plural
    }`;
  } catch {
    return `${safeDays} days`;
  }
}
