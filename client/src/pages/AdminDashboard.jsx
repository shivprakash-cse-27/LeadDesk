import { useState, useEffect } from 'react';
import { apiGet, apiPatch } from '../utils/api';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { 
  Users, UserPlus, MessageCircle, CheckCircle2, 
  Search, Loader2, Inbox, RefreshCw, Mail, Calendar,
  ArrowUpRight, DollarSign, ChevronRight, Eye
} from 'lucide-react';

const STATUS_FLOW = ['New', 'Contacted', 'Closed'];

const SkeletonRow = () => (
  <tr>
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-surface-light/20 rounded-lg w-3/4 animate-shimmer" />
      </td>
    ))}
  </tr>
);

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);
  const [recentlyChanged, setRecentlyChanged] = useState(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const data = await apiGet('/api/leads');
      setLeads(data.leads || data);
    } catch (error) {
      addToast(error.message || 'Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiPatch(`/api/leads/${id}/status`, { status: newStatus });
      setLeads(prev => prev.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
      setRecentlyChanged(id);
      setTimeout(() => setRecentlyChanged(null), 2000);
      addToast(`Status updated to ${newStatus}`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update status', 'error');
    }
  };

  const cycleStatus = (id, currentStatus) => {
    const nextIndex = (STATUS_FLOW.indexOf(currentStatus) + 1) % STATUS_FLOW.length;
    updateStatus(id, STATUS_FLOW[nextIndex]);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === 'All' || lead.status === filter);
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    closed: leads.filter(l => l.status === 'Closed').length,
  };

  const statusStyles = {
    New: { bg: 'bg-primary/15', text: 'text-primary-light', glow: 'shadow-primary/20', emoji: '🔵' },
    Contacted: { bg: 'bg-warning/15', text: 'text-warning-light', glow: 'shadow-warning/20', emoji: '🟡' },
    Closed: { bg: 'bg-success/15', text: 'text-success-light', glow: 'shadow-success/20', emoji: '🟢' },
  };

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-text-muted', accent: 'from-surface-light to-surface' },
    { label: 'New Leads', value: stats.new, icon: UserPlus, color: 'text-primary', accent: 'from-primary/20 to-primary/5' },
    { label: 'Contacted', value: stats.contacted, icon: MessageCircle, color: 'text-warning', accent: 'from-warning/20 to-warning/5' },
    { label: 'Closed Won', value: stats.closed, icon: CheckCircle2, color: 'text-success', accent: 'from-success/20 to-success/5' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative noise">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[25rem] h-[25rem] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slideDown">
          <div>
            <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
            <p className="text-text-muted mt-1 text-sm">Here's what's happening with your leads today.</p>
          </div>
          <button onClick={() => fetchLeads(true)} disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium text-text-muted hover:text-text transition-all hover-lift disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={card.label} className="glass-card rounded-2xl p-6 hover-lift group animate-slideUp" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-5 h-5" />
                </div>
                {card.label !== 'Total Leads' && stats.total > 0 && (
                  <span className="text-xs text-text-dim flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {Math.round((card.value / stats.total) * 100)}%
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-text">{card.value}</p>
              <p className="text-text-muted text-sm mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center glass-card p-4 rounded-2xl animate-slideUp" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-dim" />
            </div>
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-surface-light/30 rounded-xl bg-surface-dark/50 text-text placeholder:text-text-dim focus:border-primary/50 outline-none transition-all input-glow text-sm" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
            {['All', 'New', 'Contacted', 'Closed'].map(status => (
              <button key={status} onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  filter === status
                    ? 'btn-gradient text-white shadow-lg'
                    : 'text-text-muted hover:text-text hover:bg-surface-light/30'
                }`}>
                {status}{status !== 'All' ? ` (${stats[status.toLowerCase()] ?? 0})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-2xl overflow-hidden animate-slideUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {loading ? (
            <table className="w-full">
              <tbody>{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
            </table>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <Inbox className="w-16 h-16 mb-4 opacity-30 animate-float-slow" />
              <p className="text-lg font-medium">No leads found</p>
              <p className="text-sm text-text-dim mt-1">Try adjusting your search or filters</p>
              {(search || filter !== 'All') && (
                <button onClick={() => { setSearch(''); setFilter('All'); }}
                  className="mt-4 px-4 py-2 rounded-xl text-sm text-primary hover:bg-primary/10 transition-all">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-light/20">
                    <th className="px-6 py-4 text-xs font-semibold text-text-dim uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-dim uppercase tracking-wider hidden lg:table-cell">Contact</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-dim uppercase tracking-wider hidden lg:table-cell">Budget</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-dim uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-dim uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-dim uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-light/10">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id}
                      className="hover:bg-surface-light/5 transition-colors duration-200 group cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === lead._id ? null : lead._id)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-text text-sm">{lead.name}</div>
                            <div className="text-xs text-text-dim lg:hidden mt-0.5">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="text-sm text-text-muted hover:text-primary transition-colors flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-text-muted flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" /> {lead.budget}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={(e) => { e.stopPropagation(); cycleStatus(lead._id, lead.status); }}
                          title="Click to change status"
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                            statusStyles[lead.status].bg} ${statusStyles[lead.status].text
                          } ${recentlyChanged === lead._id ? 'animate-scaleIn shadow-lg ' + statusStyles[lead.status].glow : 'hover:shadow-md'}`}>
                          <span>{statusStyles[lead.status].emoji}</span>
                          {lead.status}
                          <RefreshCw className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </button>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs text-text-dim flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight className={`w-4 h-4 text-text-dim transition-transform duration-200 ${
                          expandedRow === lead._id ? 'rotate-90' : ''
                        }`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Expanded message preview */}
              {expandedRow && (() => {
                const lead = filteredLeads.find(l => l._id === expandedRow);
                if (!lead) return null;
                return (
                  <div className="px-6 py-4 bg-surface-dark/50 border-t border-surface-light/10 animate-slideDown">
                    <div className="flex items-start gap-3 max-w-2xl">
                      <Eye className="w-4 h-4 text-text-dim mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-text-muted mb-1">Message Preview</p>
                        <p className="text-sm text-text-muted leading-relaxed">{lead.message}</p>
                        <div className="flex gap-3 mt-3 lg:hidden">
                          <span className="text-xs text-text-dim">Budget: {lead.budget}</span>
                          <span className="text-xs text-text-dim">Email: {lead.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
