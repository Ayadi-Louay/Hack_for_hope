# 🎯 Hack for Hope - Plateforme de Signalement Sécurisée

> Hackathon 18h - Système de gestion d'incidents pour Villages d'Enfants SOS

## 📋 Description

Plateforme web sécurisée permettant de :
- ✅ Créer des signalements d'incidents (anonymes ou non)
- ✅ Gérer le workflow de traitement (3 niveaux : Déclarant → Analyste → Direction)
- ✅ Uploader des pièces jointes (photos, audio, vidéo)
- ✅ Tracer toutes les actions (audit logs)
- ✅ Contrôle d'accès par rôle (RBAC)

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  PostgreSQL  │
│  Next.js    │      │   NestJS    │      │   Database   │
│  Port 3000  │      │  Port 3001  │      │   Port 5432  │
└─────────────┘      └─────────────┘      └──────────────┘
```

### Stack Technique

**Frontend** :
- Next.js 14 (React)
- TailwindCSS (styling)
- TypeScript
- Axios (API calls)

**Backend** :
- NestJS (Node.js framework)
- TypeORM (ORM)
- JWT (authentication)
- Passport (authorization)
- Multer (file uploads)

**Base de données** :
- PostgreSQL 15

**DevOps** :
- Docker & Docker Compose
- Hot reload en développement

## 🚀 Démarrage Rapide

### Prérequis
- Docker Desktop installé
- Git

### 1) Cloner le projet
```bash
git clone <votre-repo>
cd Hack_for_hope
```

### 2) Créer le fichier .env
```bash
cp .env.example .env
```

### 3) Lancer TOUT le projet
```bash
docker-compose up --build
```

**C'est tout !** Le projet se lance automatiquement :
- ✅ PostgreSQL s'initialise avec les données de test
- ✅ Backend démarre sur http://localhost:3001
- ✅ Frontend démarre sur http://localhost:3000

### 4) Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001/api

### 5) Comptes de test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| declarant@sos.tn | password123 | DECLARANT |
| analyste@sos.tn | password123 | ANALYSTE |
| direction@sos.tn | password123 | DIRECTION |

## 📁 Structure du Projet

```
Hack_for_hope/
├── backend/                # API NestJS
│   ├── src/
│   │   ├── auth/          # Module authentification
│   │   ├── users/         # Module utilisateurs
│   │   ├── incidents/     # Module incidents
│   │   ├── uploads/       # Module uploads
│   │   └── audit/         # Module audit logs
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # Composants réutilisables
│   │   └── lib/           # Utilitaires
│   ├── Dockerfile
│   └── package.json
│
├── database/               # Scripts SQL
│   └── init.sql           # Initialisation DB
│
├── docker-compose.yml      # Orchestration des services
└── README.md
```

## 🗃️ Schéma de Base de Données

### Tables principales

- **users** : Utilisateurs (3 rôles : DECLARANT, ANALYSTE, DIRECTION)
- **incidents** : Signalements d'incidents
- **attachments** : Pièces jointes (fichiers)
- **status_history** : Historique des changements de statut
- **decisions** : Décisions prises par les analystes/direction
- **audit_logs** : Traçabilité complète (qui fait quoi, quand)

## 👥 Organisation Équipe (4 personnes)

### Personne 1 : Lead Architecture & DevOps ✅ (FAIT)
- [x] Setup Docker Compose
- [x] Configuration base de données
- [x] Structure projet
- [ ] Intégration continue

### Personne 2 : Backend Core
- [ ] Module Auth (JWT + RBAC)
- [ ] Module Incidents (CRUD)
- [ ] Module Users
- [ ] Audit Logs

### Personne 3 : Frontend Core
- [ ] Page Login
- [ ] Layout + Navigation
- [ ] Page Liste Incidents
- [ ] Page Création Incident

### Personne 4 : Features & Présentation
- [ ] Upload pièces jointes
- [ ] Dashboard avec stats
- [ ] Workflow de décision
- [ ] Pitch deck + Vidéo (à partir de H12)

## 🔒 Sécurité

- ✅ Mots de passe hashés (bcrypt)
- ✅ JWT avec expiration
- ✅ RBAC (contrôle d'accès par rôle)
- ✅ Validation des inputs
- ✅ Audit logs complets
- ✅ CORS configuré
- ✅ Uploads sécurisés

## 📝 Commandes Utiles

### Docker
```bash
# Démarrer tous les services
docker-compose up

# Rebuilder les images
docker-compose up --build

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Accéder à la base de données
docker exec -it hackforhope_db psql -U hackforhope -d hackforhope_db
```

### Backend (sans Docker)
```bash
cd backend
npm install
npm run start:dev
```

### Frontend (sans Docker)
```bash
cd frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

### Les conteneurs ne démarrent pas
```bash
# Nettoyer les conteneurs et volumes
docker-compose down -v
docker-compose up --build
```

### Erreur de connexion à la DB
- Vérifier que PostgreSQL est démarré : `docker ps`
- Vérifier les logs : `docker-compose logs db`

### Port déjà utilisé
```bash
# Windows : trouver et tuer le processus
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Ressources

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation TypeORM](https://typeorm.io/)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)

## 🏆 Critères d'Évaluation (pour le jury)

- ✅ Pertinence métier & workflow : 25 pts
- ✅ UX/UI : 20 pts
- ✅ Architecture & qualité technique : 20 pts
- ✅ Sécurité & protection données : 20 pts
- ✅ Innovation & impact : 15 pts

## 👨‍💻 Équipe

- Oussema (vous)
- Membre 2
- Membre 3
- Membre 4

## 📄 License

Projet hackathon - Hack for Hope 2026
