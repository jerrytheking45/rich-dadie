// src/features/investment/pages/ProfileStatementsPage.tsx
import { ArrowLeft, FileText, Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { statements } from '../data/profile-demo';

const ProfileStatementsPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      alert('Please select a date range.');
      return;
    }
    alert(`Generating statement from ${startDate} to ${endDate} (demo)`);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6]">
      <main className="mx-auto w-full max-w-xl px-4 pb-8 pt-5 sm:px-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/investment/profile')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-[19px] font-extrabold text-slate-900">Statements</h1>
        </header>

        {/* Generate Statement */}
        <section className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Generate Statement</h2>
          <p className="mt-1 text-xs text-slate-500">Create a custom statement for any date range</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-emerald-400"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <Plus size={16} /> Generate Statement
          </button>
        </section>

        {/* Available Statements */}
        <section className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">Available Statements</h2>
          <p className="mt-1 text-xs text-slate-500">Download your monthly investment statements</p>
          <div className="mt-4 space-y-3">
            {statements.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No statements available</p>
            ) : (
              statements.map((stmt) => (
                <div key={stmt.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{stmt.period}</p>
                      <p className="text-xs text-slate-400">Generated: {new Date(stmt.dateGenerated).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${stmt.period} statement (demo)`)}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
                  >
                    <Download size={14} /> PDF
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
export default ProfileStatementsPage;