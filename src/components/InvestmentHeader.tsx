
// src/components/InvestmentHeader.tsx
'use client';

import Image from 'next/image';
import {
  Check,
  ChevronDown,
  Globe,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';

import NotificationBell from '@/src/components/NotificationBell';
import {
  SUPPORTED_LANGUAGES,
} from '@/src/constants/settings';
import { useSettings } from '@/src/context/useSettings';
import { useTranslation } from '../i18n/translations';

interface InvestmentHeaderProps {
  name?: string;
  avatar?: string;
  onSearch?: () => void;
}

const DEFAULT_MEMBER_NAME = 'Team Member';

export default function InvestmentHeader({
  name = DEFAULT_MEMBER_NAME,
  avatar,
  onSearch,
}: InvestmentHeaderProps) {
  const { t } = useTranslation();

  const {
    language,
    setLanguage,
  } = useSettings();

  const [
    showLanguageModal,
    setShowLanguageModal,
  ] = useState(false);

  const displayName =
    name.trim() || DEFAULT_MEMBER_NAME;

  const avatarInitial =
    displayName.charAt(0).toUpperCase();

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find(
      (item) => item.code === language,
    );

  const handleLanguageChange = (
    code: typeof language,
  ) => {
    setLanguage(code);
    setShowLanguageModal(false);
  };

  return (
    <>
      <header className="flex w-full items-center justify-between gap-3">
        {/* ----------------------------------------------------------
            LEFT â€” USER PROFILE
        ----------------------------------------------------------- */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[15px] border border-white/10 bg-[#101D33] shadow-lg shadow-black/10">
            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                fill
                sizes="44px"
                className="object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-400/20 to-purple-400/10 text-sm font-black text-emerald-200">
                {avatarInitial}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium text-white/30">
              {t('header.welcome_back')}
            </p>

            <button
              type="button"
              className="flex max-w-42.5 items-center gap-1 rounded-md text-sm font-black text-white transition hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/30"
              aria-label={displayName}
            >
              <span className="truncate">
                {displayName}
              </span>

              <ChevronDown
                size={13}
                className="shrink-0 text-white/25"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------
            RIGHT â€” HEADER ACTIONS
        ----------------------------------------------------------- */}
        <div className="flex shrink-0 items-center gap-2">

          {/* SEARCH */}
          <button
            type="button"
            onClick={onSearch}
            className="flex h-10 w-10 items-center justify-center rounded-full   text-white/45 transition hover:border-emerald-300/20  hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/30 active:scale-95"
            aria-label="Search"
          >
            <Search
              size={17}
              aria-hidden="true"
            />
          </button>
          {/* LANGUAGE */}
          <button
            type="button"
            onClick={() =>
              setShowLanguageModal(true)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full  text-white/45 transition hover:border-blue-400/20  hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 active:scale-95"
            aria-label={`Language: ${
              selectedLanguage?.label ?? language
            }`}
            title={
              selectedLanguage?.label ??
              language
            }
          >
            <Globe
              size={17}
              aria-hidden="true"
            />
          </button>

          {/* NOTIFICATIONS */}
          <div className="[&>button]:border-white/8 [&>button]:bg-[#0B1426] [&>button]:text-white/45">
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* ============================================================
          LANGUAGE MODAL
      ============================================================= */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="header-language-modal-title"
          onClick={() =>
            setShowLanguageModal(false)
          }
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/10 text-blue-400">
                  <Globe size={18} />
                </div>

                <div className="min-w-0">
                  <p
                    id="header-language-modal-title"
                    className="text-sm font-extrabold text-white"
                  >
                    Choose Language
                  </p>

                  <p className="mt-0.5 text-[10px] text-white/35">
                    Select your preferred platform language
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowLanguageModal(false)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/45 transition hover:bg-white/8 hover:text-white active:scale-95"
                aria-label="Close language selector"
              >
                <X size={17} />
              </button>
            </div>

            {/* LANGUAGE OPTIONS */}
            <div className="max-h-[60vh] overflow-y-auto p-3">
              <div className="space-y-1.5">
                {SUPPORTED_LANGUAGES.map(
                  (item) => {
                    const selected =
                      language === item.code;

                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() =>
                          handleLanguageChange(
                            item.code,
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99] ${
                          selected
                            ? 'border-blue-400/20 bg-blue-400/10'
                            : 'border-transparent bg-white/3 hover:border-white/8 hover:bg-white/6'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {/* LANGUAGE CODE */}
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${
                              selected
                                ? 'bg-blue-400/15 text-blue-400'
                                : 'bg-white/5 text-white/40'
                            }`}
                          >
                            {item.code
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          {/* LANGUAGE NAME */}
                          <div className="min-w-0">
                            <p
                              className={`truncate text-xs font-bold ${
                                selected
                                  ? 'text-white'
                                  : 'text-white/70'
                              }`}
                            >
                              {item.label}
                            </p>

                            {selected && (
                              <p className="mt-0.5 text-[9px] font-semibold text-blue-400/70">
                                Currently selected
                              </p>
                            )}
                          </div>
                        </div>

                        {/* SELECTED CHECK */}
                        {selected && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-400 text-[#050B18]">
                            <Check
                              size={15}
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="border-t border-white/8 px-5 py-3.5">
              <p className="text-center text-[9px] text-white/25">
                REDIQ language preferences
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

