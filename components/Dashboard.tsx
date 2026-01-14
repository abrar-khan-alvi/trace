import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Award, TrendingUp, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data for the chart
  const data = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 1.8 },
    { name: 'Wed', hours: 3.2 },
    { name: 'Thu', hours: 2.0 },
    { name: 'Fri', hours: 4.1 },
    { name: 'Sat', hours: 5.0 },
    { name: 'Sun', hours: 3.5 },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, John! 👋</h1>
        <p className="text-slate-500 mt-2">You're on track for your SAT prep. Keep up the momentum.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Study Time" 
          value="24.5h" 
          subtitle="+12% from last week" 
          icon={Clock} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Avg. Score" 
          value="88%" 
          subtitle="Top 15% of users" 
          icon={Award} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Streak" 
          value="12 Days" 
          subtitle="Keep it going!" 
          icon={TrendingUp} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Topics Mastered" 
          value="42" 
          subtitle="5 new this week" 
          icon={BookOpen} 
          color="bg-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Study Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#6366f1' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Up Next Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Up Next</h3>
          <div className="flex-1 space-y-4">
             <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-amber-700 uppercase">Priority</span>
                 <span className="text-xs text-amber-600">Due Tomorrow</span>
               </div>
               <p className="font-semibold text-slate-800">Algebra II: Quadratic Equations</p>
               <button className="mt-3 w-full py-1.5 bg-amber-200 text-amber-900 text-sm font-medium rounded hover:bg-amber-300 transition-colors">
                 Start Quiz
               </button>
             </div>
             
             <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Flashcards</p>
                <p className="font-medium text-slate-700">SAT Vocabulary Set 4</p>
             </div>

             <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Review</p>
                <p className="font-medium text-slate-700">History: The Cold War</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
