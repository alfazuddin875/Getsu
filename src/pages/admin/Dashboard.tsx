import { useAppStore } from '../../lib/store';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const registrations = useAppStore(state => state.registrations);

  const totalRegistrations = registrations.length;
  const pending = registrations.filter(r => r.status === 'pending').length;
  const approved = registrations.filter(r => r.status === 'approved').length;
  const rejected = registrations.filter(r => r.status === 'rejected').length;

  const totalFund = registrations
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.payment.totalAmount, 0);

  const totalGuests = registrations
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.guests.length, 0);

  const stats = [
    { label: 'Total Submitted', value: totalRegistrations, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Pending Verification', value: pending, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Approved', value: approved, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Total Collected Fund', value: `৳${totalFund.toLocaleString()}`, color: 'bg-teal-50 text-teal-700 border-teal-200' },
  ];

  // Prepare data for the SSC Batch chart
  const batchCounts = registrations.reduce((acc, reg) => {
    const batch = reg.personal_info.sscBatch || 'Unknown';
    if (!acc[batch]) {
      acc[batch] = 0;
    }
    acc[batch]++;
    return acc;
  }, {} as Record<string, number>);

  const batchData = Object.entries(batchCounts)
    .map(([batch, count]) => ({ batch, count }))
    .sort((a, b) => parseInt(a.batch) - parseInt(b.batch));

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(stat => (
          <div key={stat.label} className={`p-5 md:p-6 rounded-2xl border ${stat.color} shadow-sm flex flex-col justify-between h-32 transition-transform hover:scale-[1.02]`}>
            <span className="text-xs md:text-sm font-bold opacity-80 uppercase tracking-wider">{stat.label}</span>
            <span className="text-2xl md:text-3xl font-black">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Insights & Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Insights</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Expected Attendees</p>
              <p className="text-2xl font-bold text-slate-800">
                {approved + totalGuests} <span className="text-sm font-normal text-slate-500">({approved} Alumni + {totalGuests} Guests)</span>
              </p>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-slate-800 mb-4">Registrations by SSC Batch</h2>
          <div className="flex-1 w-full h-64 min-h-[250px]">
            {batchData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="batch" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} name="Registrations" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm border border-dashed rounded-xl border-slate-200 bg-slate-50">
                Not enough data to display chart
              </div>
            )}
          </div>
          
          <div className="mt-8 flex gap-4">
            <Link to="/admin/registrations" className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Verify Pending Tickets &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {registrations.slice(-4).reverse().map(reg => (
              <div key={reg.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{reg.personal_info.fullName}</p>
                  <p className="text-xs text-slate-500">TrxID: {reg.payment.trxId}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  reg.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  reg.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {reg.status}
                </span>
              </div>
            ))}
            {registrations.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No registrations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

