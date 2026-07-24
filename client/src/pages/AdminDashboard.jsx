import { useState, useEffect } from 'react';
import { apiGet, apiPatch } from '../utils/api';
import { useToast } from '../components/Toast';
import { 
  Users, UserPlus, MessageCircle, CheckCircle2, 
  Search, Loader2, Inbox, RefreshCw, ChevronDown
} from 'lucide-react';

const STATUS_FLOW = ['New', 'Contacted', 'Closed'];

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const { addToast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/leads');
      setLeads(data.leads || data);
    } catch (error) {
      addToast(error.message || 'Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiPatch(`/api/leads/${id}/status`, { status: newStatus });
      setLeads(prev => prev.map(lead => 
        lead._id === id ? { ...lead, status: newStatus } : lead
      ));
      addToast(`Status updated to ${newStatus}`, 'success');
    } catch (error) {
      addToast(error.message || 'Failed to update status', 'error');
    }
  };

  const cycleStatus = (id, currentStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_FLOW.length;
    updateStatus(id, STATUS_FLOW[nextIndex]);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || lead.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    closed: leads.filter(l => l.status === 'Closed').length,
  };

  const StatusBadge = ({ status, onClick }) => {
    const styles = {
      New: 'bg-primary/20 text-primary hover:bg-primary/30',
      Contacted: 'bg-warning/20 text-warning hover:bg-warning/30',
      Closed: 'bg-success/20 text-success hover:bg-success/30'
    };

    return (
      <button 
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 flex items-center gap-1 ${styles[status]}`}
      >
        {status}
        <RefreshCw className="w-3 h-3 opacity-50" />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        
        {/* Header & Stats */}
        <div>
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-text">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-text-muted">
                <Users className="w-6 h-6" />
              </div>
            </div>
            
            <div className="glass p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">New Leads</p>
                <p className="text-3xl font-bold text-primary">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Contacted</p>
                <p className="text-3xl font-bold text-warning">{stats.contacted}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-warning">
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium mb-1">Closed</p>
                <p className="text-3xl font-bold text-success">{stats.closed}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/30 p-4 rounded-2xl border border-surface-light">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-surface-light rounded-xl bg-surface/50 text-text placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex w-full sm:w-auto gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'New', 'Contacted', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === status 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-surface hover:bg-surface-light text-text-muted hover:text-text'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        <div className="glass rounded-2xl overflow-hidden border border-surface-light">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p>Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <Inbox className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">No leads found</p>
              {search || filter !== 'All' ? (
                <button onClick={() => { setSearch(''); setFilter('All'); }} className="mt-2 text-primary hover:underline">
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-surface-light text-text-muted text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium hidden md:table-cell">Contact Info</th>
                    <th className="p-4 font-medium hidden lg:table-cell">Budget</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-light">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-surface/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-text">{lead.name}</div>
                        <div className="text-sm text-text-muted md:hidden mt-1">{lead.email}</div>
                        <div className="text-sm text-text-muted lg:hidden mt-1">{lead.budget}</div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <a href={`mailto:${lead.email}`} className="text-sm text-text hover:text-primary transition-colors">
                          {lead.email}
                        </a>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm text-text bg-surface-light px-2 py-1 rounded-md">
                          {lead.budget}
                        </span>
                      </td>
                      <td className="p-4">
                        <StatusBadge 
                          status={lead.status} 
                          onClick={() => cycleStatus(lead._id, lead.status)} 
                        />
                      </td>
                      <td className="p-4 hidden sm:table-cell text-sm text-text-muted">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
