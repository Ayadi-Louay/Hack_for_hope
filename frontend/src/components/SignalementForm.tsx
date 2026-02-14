'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { incidentsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mic, 
  StopCircle, 
  Upload, 
  X, 
  Send, 
  Sparkles, 
  AlertTriangle,
  LogOut,
  User,
  MapPin
} from 'lucide-react';
import { IncidentType, UrgenceLevel } from '@/lib/types';

const VILLAGES = [
  'Gammarth',
  'Siliana',
  'Akouda',
  'Mahrès',
  'Autre'
];

interface FormData {
  reporterName: string;
  isAnonymous: boolean;
  village: string;
  childName: string;
  abuserName: string;
  urgencyLevel: 'BAS' | 'MOYEN' | 'CRITIQUE';
  description: string;
}

export default function SignalementForm() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    reporterName: user?.nom || '',
    isAnonymous: false,
    village: '',
    childName: '',
    abuserName: '',
    urgencyLevel: 'MOYEN',
    description: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const isCritical = formData.urgencyLevel === 'CRITIQUE';

  // === SPEECH-TO-TEXT ===
  const toggleDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La dictée vocale n\'est pas supportée sur ce navigateur. Utilisez Chrome ou Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          description: prev.description ? `${prev.description} ${transcript}` : transcript
        }));
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  // === AUDIO RECORDING ===
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
        setFiles(prev => [...prev, file]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // === FILE UPLOAD ===
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // === FORM CHANGE ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // === SUBMIT ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.description.trim()) {
        throw new Error('La description est obligatoire');
      }

      // Créer l'incident
      await incidentsAPI.create({
        type: IncidentType.AUTRE,
        urgence: formData.urgencyLevel as UrgenceLevel,
        village: formData.village || 'Non spécifié',
        nomEnfant: formData.childName || undefined,
        nomAbuseur: formData.abuserName || undefined,
        description: formData.description,
        isAnonymous: formData.isAnonymous,
      });

      // TODO: Upload des fichiers si nécessaire
      // Pour l'instant, on skip l'upload de fichiers

      setSuccess(true);
      
      // Réinitialiser le formulaire
      setTimeout(() => {
        setFormData({
          reporterName: user?.nom || '',
          isAnonymous: false,
          village: '',
          childName: '',
          abuserName: '',
          urgencyLevel: 'MOYEN',
          description: '',
        });
        setFiles([]);
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'envoi du signalement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isCritical 
        ? 'bg-gradient-to-br from-red-900 via-red-700 to-orange-600' 
        : 'bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100'
    }`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-200">
              <img 
                src="https://jamaity.org/wp-content/uploads/2014/05/logo_ong_sosvillage.jpg" 
                alt="SOS Villages"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">SafeGuard</h1>
              <p className="text-xs text-slate-500">Nouveau signalement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-800">{user?.nom}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Alert critique */}
        {isCritical && (
          <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center space-x-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
            <p className="text-white font-bold">🚨 URGENCE CRITIQUE - Signalement prioritaire</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-green-800 font-bold">✅ Signalement envoyé avec succès !</p>
            <p className="text-sm text-green-600 mt-1">Votre signalement a été transmis aux équipes compétentes.</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800 font-bold">❌ Erreur</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-200">
          
          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-slate-600" />
              <label htmlFor="isAnonymous" className="font-bold text-slate-800 cursor-pointer">
                Signalement anonyme
              </label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          {/* Nom du déclarant (si pas anonyme) */}
          {!formData.isAnonymous && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Votre nom complet
              </label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-900"
                placeholder="Ex: Marie Dupont"
              />
            </div>
          )}

          {/* Village */}
          <div>
            <label htmlFor="village" className="block text-sm font-bold text-slate-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Village concerné
            </label>
            <select
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-900"
            >
              <option value="">Sélectionnez un village</option>
              {VILLAGES.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Nom de l'enfant */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nom de l&apos;enfant concerné (optionnel)
            </label>
            <input
              type="text"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-900"
              placeholder="Ex: Sophie M."
            />
          </div>

          {/* Nom de l'abuseur */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nom de la personne mise en cause (optionnel)
            </label>
            <input
              type="text"
              name="abuserName"
              value={formData.abuserName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-900"
              placeholder="Ex: Jean D."
            />
          </div>

          {/* Niveau d'urgence */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Niveau d&apos;urgence *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['BAS', 'MOYEN', 'CRITIQUE'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, urgencyLevel: level }))}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
                    formData.urgencyLevel === level
                      ? level === 'BAS'
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                        : level === 'MOYEN'
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                        : 'bg-red-500 border-red-500 text-white shadow-lg animate-pulse'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {level === 'BAS' ? '🟢 Bas' : level === 'MOYEN' ? '🟡 Moyen' : '🔴 Critique'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">
              Description détaillée du signalement *
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-900 resize-none"
                placeholder="Décrivez les faits observés de manière détaillée..."
              />
              
              {/* Bouton dictée */}
              <button
                type="button"
                onClick={toggleDictation}
                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                }`}
                title="Dictée vocale"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
            {isListening && (
              <p className="text-sm text-sky-600 mt-2 flex items-center">
                <span className="animate-pulse mr-2">🎤</span>
                En écoute... Parlez maintenant
              </p>
            )}
          </div>

          {/* Audio Recording */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Enregistrement audio (optionnel)
            </label>
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {isRecording ? (
                <>
                  <StopCircle className="w-5 h-5" />
                  <span>Arrêter l&apos;enregistrement</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Enregistrer un message vocal</span>
                </>
              )}
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Photos ou vidéos (optionnel)
            </label>
            <label className="w-full py-8 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-sky-500 transition-all cursor-pointer flex flex-col items-center justify-center bg-slate-50 hover:bg-sky-50">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-600 font-medium">Cliquez pour ajouter des fichiers</span>
              <span className="text-xs text-slate-400 mt-1">Images, vidéos acceptées</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Liste des fichiers */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith('audio') ? (
                        <Mic className="w-5 h-5 text-sky-600" />
                      ) : (
                        <Upload className="w-5 h-5 text-sky-600" />
                      )}
                      <span className="text-sm text-slate-700 font-medium truncate max-w-xs">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.description.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isCritical
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-300'
                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sky-200'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Envoyer le signalement</span>
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center">
            * Champs obligatoires : Mode anonyme et Description
          </p>
        </form>
      </main>
    </div>
  );
}
