# 🔧 CORRECTION DE L'ERREUR DE CONNEXION

## Problème identifié

L'erreur de connexion était causée par **2 problèmes** :

1. **Mauvaise URL API** : Le frontend appelait `http://localhost:3000/api` mais le backend tourne sur le port **3001**
2. **Backend non démarré** : Le backend NestJS doit être lancé via Docker Compose

## Solutions appliquées

### ✅ 1. Configuration de l'URL API

**Fichier créé** : `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### ✅ 2. Configuration CORS du backend

**Fichier modifié** : `backend/src/main.ts`
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://frontend:3000'],
  credentials: true,
});
```

## 🚀 Comment lancer l'application

### Étape 1 : Démarrer Docker Desktop
Lancez l'application Docker Desktop sur votre machine.

### Étape 2 : Démarrer tous les services
```powershell
docker-compose up -d
```

Cette commande va lancer :
- 🗄️ PostgreSQL (port 5432)
- 🚀 Backend NestJS (port 3001)
- ⚛️ Frontend Next.js (port 3000)

### Étape 3 : Vérifier que tout fonctionne
```powershell
docker-compose ps
```

Vous devriez voir 3 conteneurs en état "Up" :
- `hackforhope_db`
- `hackforhope_backend`
- `hackforhope_frontend`

### Étape 4 : Se connecter à l'application

Ouvrez votre navigateur sur **http://localhost:3002** (ou 3000 si Docker)

**Comptes de test** :
| Rôle | Email | Password |
|------|-------|----------|
| Déclarant | declarant1@test.com | password123 |
| Psychologue | psycho1@test.com | password123 |
| Responsable Social | resp1@test.com | password123 |
| Directeur Village | dir.gammarth@test.com | password123 |
| Directeur National | directeur.national@test.com | password123 |

## ⚠️ Si le frontend tourne déjà sur le port 3002

Le frontend développé manuellement tourne actuellement sur **localhost:3002**.
Si vous voulez utiliser Docker Compose, arrêtez d'abord le serveur Next.js manuel :

```powershell
# Arrêter le serveur Next.js manuel
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

Puis lancez Docker Compose qui mettra le frontend sur le **port 3000**.

## 🎯 Résumé des services

| Service | Port | URL |
|---------|------|-----|
| Frontend Next.js | 3002 (manuel) ou 3000 (Docker) | http://localhost:3002 ou 3000 |
| Backend NestJS | 3001 | http://localhost:3001/api |
| PostgreSQL | 5432 | localhost:5432 |

## ✅ Vérification

Une fois tous les services démarrés, le login devrait fonctionner sans erreur !

---

**Créé le :** 14 février 2026  
**Hack for Hope - SafeGuard Platform**
