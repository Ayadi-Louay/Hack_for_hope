export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          🎯 Hack for Hope
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plateforme de Signalement Sécurisée
        </p>
        <div className="space-x-4">
          <a href="/login" className="btn-primary inline-block">
            Se connecter
          </a>
          <a 
            href={`${process.env.NEXT_PUBLIC_API_URL}/api`}
            target="_blank"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors inline-block"
          >
            API Backend
          </a>
        </div>
        
        <div className="mt-12 p-6 bg-green-50 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            ✅ Setup terminé avec succès !
          </h2>
          <div className="text-left space-y-2 text-green-700">
            <p>✓ Backend API : <code className="bg-green-100 px-2 py-1 rounded">http://localhost:3001</code></p>
            <p>✓ Frontend : <code className="bg-green-100 px-2 py-1 rounded">http://localhost:3000</code></p>
            <p>✓ Base de données : PostgreSQL initialisée (8 tables)</p>
            <p>✓ 11 utilisateurs test créés (password: password123)</p>
            <p className="text-sm mt-4 text-green-600">
              → 1 Directeur National | 4 Directeurs Village | 2 Psychologues | 2 Responsables Sociaux | 2 Déclarants
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
