import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan } from '../types';
import { Loader2, Calendar, Target, AlertCircle } from 'lucide-react';

const Planner: React.FC = () => {
  const [examName, setExamName] = useState('');
  const [days, setDays] = useState<number>(7);
  const [weaknesses, setWeaknesses] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !weaknesses) return;

    setLoading(true);
    try {
      const result = await generateStudyPlan(examName, days, weaknesses);
      setPlan(result);
    } catch (err) {
      alert("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">AI Study Planner</h2>
        <p className="text-slate-500 mt-2">Generate a personalized roadmap to ace your next exam.</p>
      </div>

      {!plan ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Exam Name</label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. SAT, AP Biology, GED"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Days Until Exam</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  min={1}
                  max={30}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Weak Areas & Goals</label>
              <textarea
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                placeholder="e.g. I struggle with geometry proofs and reading comprehension speed..."
                rows={4}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...
                </>
              ) : (
                'Create My Plan'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Your Plan for {plan.examName}</h3>
            <button 
              onClick={() => setPlan(null)} 
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Create New Plan
            </button>
          </div>

          <div className="grid gap-6">
            {plan.schedule.map((day) => (
              <div key={day.day} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-24 bg-indigo-50 rounded-lg p-4 text-indigo-700">
                  <span className="text-xs font-bold uppercase tracking-wider">Day</span>
                  <span className="text-3xl font-bold">{day.day}</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-lg font-bold text-slate-900">{day.topic}</h4>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <Target className="w-3 h-3 mr-1" /> {day.focus}
                    </span>
                  </div>
                  
                  <ul className="space-y-3">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
