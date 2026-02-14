'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { incidentsAPI } from '@/lib/api';
import type { Incident } from '@/lib/types';
import { ClassificationStatus } from '@/lib/types';
import { 
  LogOut, 
  Search, 
  Bell, 
  Filter,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  Mic,
  MessageCircle,
  X,
  Star,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  showClassification?: boolean;
  title?: string;
  subtitle?: string;
}

export default function Dashboard({ 
  showClassification = false,
  title = "Tableau de bord",
  subtitle = "Supervision des signalements"
}: DashboardProps) {
  const { user, logout } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les incidents
  useEffect(() => {
    loadIncidents();
  }, []);

  // Filtrer les incidents
  useEffect(() => {
    let result = incidents;

    // Filtre par statut
    if (filterStatus !== 'tous') {
      result = result.filter(i => i.status === filterStatus);
    }

    // Recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(i =>
        i.nomEnfant?.toLowerCase().includes(term) ||
        i.village.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term)
      );
    }

    setFilteredIncidents(result);
  }, [incidents, filterStatus, searchTerm]);

  const loadIncidents = async () => {
    try {
      setIsLoading(true);
      const data = await incidentsAPI.getAll();
      setIncidents(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des incidents');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassify = async (id: number, classification: ClassificationStatus) => {
    try {
      await incidentsAPI.update(id, { classification });
      
      // Mettre à jour localement
      setIncidents(prev => prev.map(i => 
        i.id === id ? { ...i, classification } : i
      ));
      
      if (selectedIncident?.id === id) {
        setSelectedIncident(prev => prev ? { ...prev, classification } : null);
      }
    } catch (err) {
      alert('Erreur lors de la classification');
      console.error(err);
    }
  };

  // Statistiques
  const stats = {
    total: incidents.length,
    urgent: incidents.filter(i => i.urgence === 'CRITIQUE').length,
    pending: incidents.filter(i => i.status === 'NOUVEAU').length,
    closed: incidents.filter(i => i.status === 'CLOTURE').length,
  };

  const getUrgencyColor = (urgence: string) => {
    switch (urgence) {
      case 'CRITIQUE':
        return 'bg-red-500';
      case 'MOYEN':
        return 'bg-orange-400';
      case 'BAS':
        return 'bg-emerald-400';
      default:
        return 'bg-slate-400';
    }
  };

  const getClassificationBadge = (classification?: string) => {
    switch (classification) {
      case 'SAUVEGARDE':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'PRISE_EN_CHARGE':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'FAUX':
        return 'bg-slate-50 text-slate-500 border-slate-200';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-sky-600 to-blue-700 text-white flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-8 flex items-center border-b border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mr-4 flex items-center justify-center shadow-inner overflow-hidden">
            <img 
              src="https://jamaity.org/wp-content/uploads/2014/05/logo_ong_sosvillage.jpg" 
              alt="SOS"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">SafeGuard</h1>
            <p className="text-xs text-sky-200">{user?.role}</p>
          </div>
        </div>
        
        <nav className="flex-1 py-8 space-y-3 px-6">
          <NavItem icon={<FileText className="w-5 h-5" />} label="Tableau de bord" active />
          <NavItem icon={<TrendingUp className="w-5 h-5" />} label="Analyses" />
          <NavItem icon={<Users className="w-5 h-5" />} label="Équipes" />
          <NavItem icon={<Calendar className="w-5 h-5" />} label="Calendrier" />
        </nav>

        <div className="p-6">
          <div className="bg-blue-800/40 rounded-xl p-4 border border-blue-500/30 backdrop-blur-sm">
            <p className="text-sm font-medium text-white">{user?.nom}</p>
            <p className="text-xs text-blue-300 mt-1">{user?.email}</p>
            <button
              onClick={logout}
              className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl h-24 flex items-center justify-between px-10 z-10 border-b border-slate-200/60">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{title}</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">{subtitle}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full w-64 text-sm font-medium focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all outline-none"
              />
            </div>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-sky-600 transition shadow-sm relative">
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-200">
              {user?.nom?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total" value={stats.total} color="text-sky-600" bg="bg-sky-50" icon={<FileText className="w-6 h-6" />} />
            <StatCard title="Urgence Critique" value={stats.urgent} color="text-red-500" bg="bg-red-50" icon={<AlertTriangle className="w-6 h-6" />} />
            <StatCard title="À Traiter" value={stats.pending} color="text-orange-500" bg="bg-orange-50" icon={<Clock className="w-6 h-6" />} />
            <StatCard title="Clôturés" value={stats.closed} color="text-emerald-500" bg="bg-emerald-50" icon={<CheckCircle className="w-6 h-6" />} />
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-200">
              {[
                { value: 'tous', label: 'Tous' },
                { value: 'NOUVEAU', label: 'Nouveaux' },
                { value: 'EN_COURS', label: 'En cours' },
                { value: 'CLOTURE', label: 'Clôturés' }
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    filterStatus === f.value
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {filteredIncidents.length} Dossier{filteredIncidents.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Incidents Grid */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {filteredIncidents.map(incident => (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Barre colorée selon urgence */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getUrgencyColor(incident.urgence)}`}></div>

                <div className="flex justify-between items-start mb-5 pl-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getClassificationBadge(incident.classification)}`}>
                    {incident.classification || 'EN ATTENTE'}
                  </span>
                  
                  {incident.aiScore && (
                    <div className="flex items-center space-x-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                      <Star className="w-3 h-3 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-700">{incident.aiScore}%</span>
                    </div>
                  )}
                </div>

                <div className="pl-2">
                  <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">
                    {incident.nomEnfant || 'Enfant non spécifié'}
                  </h3>
                  <p className="text-sm text-slate-400 mb-5 flex items-center font-medium">
                    <MapPin className="w-4 h-4 mr-1.5 text-slate-300" />
                    {incident.village} • {new Date(incident.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-5 leading-relaxed">
                    {incident.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getUrgencyColor(incident.urgence)}`}></div>
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        {incident.urgence}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                      #{incident.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Aucun signalement trouvé</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de détails */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onClassify={showClassification ? handleClassify : undefined}
        />
      )}
    </div>
  );
}

// Composant NavItem
function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all font-medium ${
      active
        ? 'bg-white/10 text-white shadow-inner backdrop-blur-sm border border-white/5'
        : 'text-sky-100/70 hover:bg-white/5 hover:text-white'
    }`}>
      <span className="mr-3">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

// Composant StatCard
function StatCard({ title, value, color, bg, icon }: { title: string; value: number; color: string; bg: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <p className="text-4xl font-black text-slate-800">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center transition-transform group-hover:rotate-12`}>
        {icon}
      </div>
    </div>
  );
}

// Composant Modal
function IncidentModal({ 
  incident, 
  onClose, 
  onClassify 
}: { 
  incident: Incident; 
  onClose: () => void;
  onClassify?: (id: number, classification: ClassificationStatus) => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden flex">
        
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="inline-flex items-center space-x-2 bg-sky-100 px-3 py-1 rounded-full text-sky-700 text-xs font-bold mb-3 uppercase tracking-wide">
                  <MapPin className="w-3 h-3" />
                  <span>{incident.village}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-800">
                  {incident.nomEnfant || 'Enfant non spécifié'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Signalement #{incident.id} • {new Date(incident.createdAt).toLocaleDateString('fr-FR', { 
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Corps scrollable */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {/* AI Analysis si disponible */}
            {incident.aiScore && (
              <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-3xl border border-indigo-100 mb-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-indigo-200">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-indigo-900">Analyse IA</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center bg-white/60 p-3 rounded-xl border border-indigo-50">
                    <p className="text-xs font-bold text-indigo-400 uppercase">Risque</p>
                    <div className="text-3xl font-black text-indigo-600">{incident.aiScore}/100</div>
                  </div>
                  <div className="col-span-2">
                    {incident.aiTags && incident.aiTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {incident.aiTags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-md shadow-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {incident.aiSummary && (
                      <p className="text-sm text-indigo-800 italic">&quot;{incident.aiSummary}&quot;</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 mb-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" />
                Description détaillée
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{incident.description}</p>
            </div>

            {/* Informations complémentaires */}
            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Urgence" value={incident.urgence} />
              <InfoCard label="Type" value={incident.type} />
              <InfoCard label="Statut" value={incident.status} />
              <InfoCard label="Anonyme" value={incident.isAnonymous ? 'Oui' : 'Non'} />
              {incident.nomAbuseur && (
                <InfoCard label="Personne mise en cause" value={incident.nomAbuseur} />
              )}
            </div>
          </div>
        </div>

        {/* Panel de classification */}
        {onClassify && (
          <div className="w-80 bg-white border-l border-slate-200 p-8 flex flex-col shadow-xl">
            <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">
              Décision de Classement
            </h4>
            <div className="space-y-2">
              <ClassificationButton
                active={incident.classification === 'SAUVEGARDE'}
                label="Sauvegarde"
                color="bg-red-500"
                textColor="text-red-700"
                bgLight="bg-red-50"
                borderColor="border-red-500"
                onClick={() => onClassify(incident.id, ClassificationStatus.SAUVEGARDE)}
              />
              <ClassificationButton
                active={incident.classification === 'PRISE_EN_CHARGE'}
                label="Prise en Charge"
                color="bg-orange-500"
                textColor="text-orange-700"
                bgLight="bg-orange-50"
                borderColor="border-orange-500"
                onClick={() => onClassify(incident.id, ClassificationStatus.PRISE_EN_CHARGE)}
              />
              <ClassificationButton
                active={incident.classification === 'FAUX'}
                label="Faux Signalement"
                color="bg-slate-500"
                textColor="text-slate-700"
                bgLight="bg-slate-100"
                borderColor="border-slate-500"
                onClick={() => onClassify(incident.id, ClassificationStatus.FAUX)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant ClassificationButton
function ClassificationButton({
  active,
  label,
  color,
  textColor,
  bgLight,
  borderColor,
  onClick
}: {
  active: boolean;
  label: string;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between ${
        active ? `${borderColor} ${bgLight} ${textColor}` : 'border-slate-100 hover:border-slate-300 text-slate-500'
      }`}
    >
      <span className="font-bold text-sm">{label}</span>
      {active && <div className={`w-3 h-3 ${color} rounded-full shadow-sm`}></div>}
    </button>
  );
}

// Composant InfoCard
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
