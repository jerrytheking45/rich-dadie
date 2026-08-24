// src/features/investment/pages/TeamPage.tsx

import {
  ArrowLeft,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import InvestmentBottomNav from "../components/InvestmentBottomNav";
import TeamMemberCard from "../components/TeamMemberCard";
import TeamSummaryCard from "../components/TeamSummaryCard";

import { teamMembers } from "../data/investment-demo";

const TeamPage = () => {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const totalMembers = teamMembers.length;

    const activeInvestors = teamMembers.filter(
      (member) => member.status === "ACTIVE",
    ).length;

    const totalInvested = teamMembers.reduce(
      (sum, member) => sum + member.investedAmount,
      0,
    );

    const averageInvestment =
      totalMembers > 0
        ? totalInvested / totalMembers
        : 0;

    const participationRate =
      totalMembers > 0
        ? Math.round(
            (activeInvestors / totalMembers) * 100,
          )
        : 0;

    return {
      totalMembers,
      activeInvestors,
      totalInvested,
      averageInvestment,
      participationRate,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-5 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/investment")}
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-full
                border border-slate-200
                bg-white
                text-slate-600
                shadow-sm
                transition
                hover:bg-slate-50
              "
              aria-label="Go back to investment home"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Team
              </p>

              <h1 className="text-[19px] font-extrabold tracking-tight text-slate-900">
                Investment Team
              </h1>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UsersIcon size={19} />
          </div>
        </header>

        {/* Introduction */}
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
              <TrendingUp
                size={14}
                className="text-emerald-600"
              />
            </div>

            <span className="text-xs font-bold text-emerald-600">
              {summary.activeInvestors} active investors
            </span>
          </div>

          <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-slate-900">
            Grow together.
          </h2>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
            Track team participation, investment activity,
            and the collective progress of your company
            investment community.
          </p>
        </section>

        {/* Team summary */}
        <section className="mt-6">
          <TeamSummaryCard
            totalInvested={summary.totalInvested}
            activeInvestors={summary.activeInvestors}
            totalInvestments={summary.totalMembers}
            totalMembers={summary.totalMembers}
          />
        </section>

        {/* Team performance */}
        <section className="mt-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-extrabold text-slate-900">
                Team participation
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Current investment activity
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart3 size={17} />
            </div>
          </div>

          {/* Participation */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400">
                Active participation
              </span>

              <span className="text-xs font-extrabold text-emerald-600">
                {summary.participationRate}%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${summary.participationRate}%`,
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard
              label="Team members"
              value={summary.totalMembers.toLocaleString(
                "en-UG",
              )}
            />

            <StatCard
              label="Active investors"
              value={summary.activeInvestors.toLocaleString(
                "en-UG",
              )}
              positive
            />

            <StatCard
              label="Total invested"
              value={`UGX ${summary.totalInvested.toLocaleString(
                "en-UG",
              )}`}
            />

            <StatCard
              label="Average investment"
              value={`UGX ${Math.round(
                summary.averageInvestment,
              ).toLocaleString("en-UG")}`}
            />
          </div>
        </section>

        {/* Trust notice */}
        <section className="mt-4 rounded-[22px] border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <ShieldCheck size={17} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-emerald-800">
                Team investment information
              </p>

              <p className="mt-1 text-[10px] leading-5 text-emerald-700/75">
                Team statistics provide a high-level view
                of investment participation. Individual
                investment terms and returns remain subject
                to the applicable investment agreements.
              </p>
            </div>
          </div>
        </section>

        {/* Team members */}
        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[16px] font-extrabold text-slate-900">
                Team Members
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Employees participating in the program
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
              {summary.totalMembers} members
            </span>
          </div>

          {teamMembers.length > 0 ? (
            <div className="mt-4 space-y-3">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                />
              ))}
            </div>
          ) : (
            <EmptyTeam />
          )}
        </section>

        {/* Bottom CTA */}
        <section className="mt-7 rounded-[24px] bg-slate-900 p-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Team opportunity
              </p>

              <h2 className="mt-2 text-lg font-extrabold">
                Start building together.
              </h2>

              <p className="mt-1 max-w-[280px] text-[10px] leading-5 text-white/55">
                Explore investment plans available to
                company team members.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
              <TrendingUp
                size={22}
                className="text-emerald-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/investment/plans")
            }
            className="
              mt-4
              rounded-xl
              bg-emerald-500
              px-4 py-2.5
              text-xs font-bold
              text-white
              transition
              hover:bg-emerald-400
            "
          >
            Explore investment plans
          </button>
        </section>
      </main>

      <InvestmentBottomNav />
    </div>
  );
};

function StatCard({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[9px] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-extrabold ${
          positive
            ? "text-emerald-600"
            : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyTeam() {
  return (
    <div className="mt-4 rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
        <UsersIcon size={30} />
      </div>

      <h3 className="mt-4 text-sm font-extrabold text-slate-800">
        No team members yet
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
        Team members participating in the investment
        program will appear here.
      </p>
    </div>
  );
}

export default TeamPage;