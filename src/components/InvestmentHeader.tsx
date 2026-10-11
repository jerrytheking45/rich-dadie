
// src/components/InvestmentHeader.tsx


"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Globe,
  Search,
  X,
} from "lucide-react";

import NotificationBell from "@/src/components/NotificationBell";

import {
  SUPPORTED_LANGUAGES,
} from "@/src/constants/settings";

import { useSettings } from "@/src/context/useSettings";
import { useTranslation } from "../i18n/translations";

interface InvestmentHeaderProps {
  name?: string;
  avatar?: string;
  onSearch?: () => void;
}

const DEFAULT_MEMBER_NAME = "Team Member";

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

  const [showLanguageModal, setShowLanguageModal] =
    useState(false);

  const displayName =
    name.trim() || DEFAULT_MEMBER_NAME;

  const avatarInitial =
    displayName.charAt(0).toUpperCase();

  const selectedLanguage =
    SUPPORTED_LANGUAGES.find(
      (item) => item.code === language
    );

  const handleLanguageChange = (
    code: typeof language
  ) => {
    setLanguage(code);
    setShowLanguageModal(false);
  };

  /* Close dialog with Escape and lock background scroll. */
  useEffect(() => {
    if (!showLanguageModal) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowLanguageModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showLanguageModal]);

  return (
    <>
      <header className="flex w-full min-w-0 items-center justify-between gap-2 sm:gap-3">

        {/* USER PROFILE */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#101D30] shadow-lg shadow-black/10">
            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#E60033]/10 text-sm font-black text-[#FF476B]">
                {avatarInitial}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium text-white/40">
              {t("header.welcome_back")}
            </p>

            <p
              title={displayName}
              className="mt-0.5 max-w-30 truncate text-xs font-black text-white sm:max-w-55 sm:text-sm"
            >
              {displayName}
            </p>
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">

          {/* Search */}
          <button
            type="button"
            onClick={onSearch}
            disabled={!onSearch}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-[#0B1426] text-white/55 transition hover:border-[#E60033]/25 hover:text-[#FF476B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Search size={16} aria-hidden="true" />
          </button>

          {/* Language */}
          <button
            type="button"
            onClick={() => setShowLanguageModal(true)}
            aria-label={`Language: ${
              selectedLanguage?.label ?? language
            }`}
            title={selectedLanguage?.label ?? language}
            aria-haspopup="dialog"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-[#0B1426] text-white/55 transition hover:border-[#E60033]/25 hover:text-[#FF476B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
          >
            <Globe size={16} aria-hidden="true" />
          </button>

          {/* Notifications */}
          <div className="[&>button]:border-white/8 [&>button]:bg-[#0B1426] [&>button]:text-white/55">
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* =====================================
          LANGUAGE MODAL
      ====================================== */}

      {showLanguageModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowLanguageModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="header-language-modal-title"
            className="w-full max-w-100 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1426] shadow-2xl shadow-black/50"
          >

            {/* Modal header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E60033]/20 bg-[#E60033]/10 text-[#FF476B]">
                  <Globe size={17} />
                </div>

                <div className="min-w-0">
                  <h2
                    id="header-language-modal-title"
                    className="text-xs font-black text-white sm:text-sm"
                  >
                    Choose language
                  </h2>

                  <p className="mt-0.5 text-[10px] text-white/40">
                    Select your preferred platform language
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                aria-label="Close language selector"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Language options */}
            <div className="max-h-[60vh] space-y-1 overflow-y-auto p-3">
              {SUPPORTED_LANGUAGES.map((item) => {
                const selected = language === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() =>
                      handleLanguageChange(item.code)
                    }
                    aria-pressed={selected}
                    className={[
                      "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60033]/50",
                      selected
                        ? "border-[#E60033]/25 bg-[#E60033]/10"
                        : "border-transparent bg-white/2.5 hover:border-white/10 hover:bg-white/5",
                    ].join(" ")}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black",
                          selected
                            ? "bg-[#E60033]/15 text-[#FF476B]"
                            : "bg-white/5 text-white/45",
                        ].join(" ")}
                      >
                        {item.code.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-white/85">
                          {item.label}
                        </p>

                        {selected && (
                          <p className="mt-0.5 text-[9px] font-semibold text-[#FF476B]">
                            Currently selected
                          </p>
                        )}
                      </div>
                    </div>

                    {selected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E60033] text-white">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/8 px-4 py-3 text-center">
              <p className="text-[9px] text-white/30">
                REDIQ language preferences
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}