'use client';

import { useRequireAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import SignalementForm from '@/components/SignalementForm';

export default function DeclarantPage() {
  const { isLoading } = useRequireAuth([UserRole.DECLARANT]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return <SignalementForm />;
}
