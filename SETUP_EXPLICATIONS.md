# 📚 EXPLICATION COMPLÈTE DU SETUP

## 🎯 Ce qui a été créé et POURQUOI

### 1️⃣ **docker-compose.yml** (Racine du projet)
**Rôle** : Orchestrateur qui lance TOUT le projet avec une seule commande

**Contient 3 services** :
- **db** (PostgreSQL) : Base de données qui stocke utilisateurs, incidents, fichiers
- **backend** (NestJS) : API qui gère la logique métier, authentification, RBAC
- **frontend** (Next.js) : Interface utilisateur web

**Pourquoi Docker ?**
- ✅ Tout le monde a exactement le même environnement
- ✅ Pas besoin d'installer PostgreSQL, Node.js localement
- ✅ Une commande pour tout lancer : `docker-compose up`

---

### 2️⃣ **database/init.sql** (Script d'initialisation DB)
**Rôle** : Crée automatiquement toutes les tables au démarrage de PostgreSQL

**Ce qu'il fait** :
1. Crée des **ENUMS** pour les types (rôles, statuts, types d'incidents)
2. Crée **6 tables** :
   - `users` : Tous les utilisateurs (déclarants, analystes, direction)
   - `incidents` : Les signalements
   - `attachments` : Métadonnées des fichiers uploadés
   - `status_history` : Historique des changements (traçabilité)
   - `decisions` : Décisions prises par analystes/direction
   - `audit_logs` : Trace TOUT (qui fait quoi, quand)
3. Crée des **INDEX** pour accélérer les recherches
4. Insère **3 utilisateurs test** + **3 incidents test**

**Pourquoi ce schéma ?**
- ✅ Respecte le cahier des charges (3 niveaux, workflow, audit)
- ✅ Relations claires (incident → user, incident → fichiers)
- ✅ Permet la traçabilité complète (exigence sécurité)

---

### 3️⃣ **backend/** (API NestJS)

#### **Dockerfile**
Crée une image Docker pour le backend. Installe Node.js + dépendances.

#### **package.json**
Liste toutes les dépendances npm :
- `@nestjs/core` : Framework backend
- `typeorm` + `pg` : ORM pour PostgreSQL
- `@nestjs/jwt` + `passport` : Authentification JWT
- `bcrypt` : Hash des mots de passe
- `multer` : Upload de fichiers
- `class-validator` : Validation des données

#### **tsconfig.json**
Configuration TypeScript (types, compilation).

#### **src/main.ts**
**Point d'entrée** du backend :
- Active le **CORS** (pour que le frontend puisse appeler l'API)
- Active la **validation automatique** (rejette les données invalides)
- Ajoute le préfixe `/api` à toutes les routes
- Démarre le serveur sur port 3001

#### **src/app.module.ts**
**Module racine** qui configure :
- Variables d'environnement (`.env`)
- Connexion TypeORM à PostgreSQL
- Imports des futurs modules (Auth, Users, Incidents, etc.)

**Structure à venir** :
```
src/
├── auth/         ← JWT, login, guards (Personne 2)
├── users/        ← CRUD utilisateurs (Personne 2)
├── incidents/    ← CRUD incidents (Personne 2)
├── uploads/      ← Upload fichiers (Personne 4)
└── audit/        ← Audit logs (Personne 2)
```

---

### 4️⃣ **frontend/** (Next.js)

#### **Dockerfile**
Crée une image Docker pour le frontend.

#### **package.json**
Dépendances :
- `next` + `react` : Framework frontend
- `tailwindcss` : Styling CSS
- `axios` : Requêtes HTTP vers l'API
- `react-hook-form` : Gestion des formulaires
- `zustand` : Store global (état user connecté)

#### **tsconfig.json**
Configuration TypeScript pour Next.js.

#### **next.config.js**
Configuration Next.js :
- Mode `standalone` pour Docker
- Variable d'env `NEXT_PUBLIC_API_URL` (URL du backend)

#### **tailwind.config.js**
Configuration TailwindCSS :
- Couleurs personnalisées (primary, danger, success)
- Scan des fichiers pour générer le CSS

#### **src/app/globals.css**
Styles globaux :
- Classes utilitaires (`.btn-primary`, `.card`)
- Import de TailwindCSS

#### **src/app/layout.tsx**
**Layout racine** (s'applique à toutes les pages) :
- Police Inter (Google Fonts)
- Titre de l'app
- Wrapper HTML/body

#### **src/app/page.tsx**
**Page d'accueil** :
- Affiche un message de bienvenue
- Lien vers `/login`
- Lien vers l'API backend
- Confirmation que le setup fonctionne

**Structure à venir** :
```
src/
├── app/
│   ├── login/          ← Page connexion (Personne 3)
│   ├── dashboard/      ← Dashboard (Personne 3)
│   ├── incidents/      ← Liste + détail (Personne 3)
│   └── reports/        ← Stats (Personne 4)
├── components/         ← Composants réutilisables
└── lib/
    ├── api.ts          ← Client Axios
    └── store.ts        ← Zustand store
```

---

### 5️⃣ **Fichiers de configuration**

#### **.env.example**
Template des variables d'environnement :
- Credentials PostgreSQL
- Secret JWT
- URLs

**À faire** : Copier en `.env` (déjà dans `.gitignore`)

#### **.gitignore**
Exclut du versioning :
- `node_modules/` (trop volumineux)
- `.env` (secrets)
- `dist/`, `.next/` (fichiers générés)
- `backend/uploads/*` (fichiers utilisateurs)

#### **README.md**
Documentation complète :
- Description du projet
- Architecture
- Commandes de démarrage
- Structure du code
- Troubleshooting

#### **TASKS.md**
Board de tâches :
- Répartition du travail entre les 4 personnes
- Checkpoints aux H2, H8, H16
- Plan B si manque de temps

---

## 🚀 PROCHAINES ÉTAPES (pour vous et votre équipe)

### 1. Tester le setup
```bash
# Créer le .env
cp .env.example .env

# Lancer tout
docker-compose up --build
```

**Résultat attendu** :
- Backend : http://localhost:3001 (affiche une erreur car pas de routes encore)
- Frontend : http://localhost:3000 (affiche la page d'accueil)
- DB : Initialisée avec 3 users + 3 incidents

### 2. Vérifier la DB
```bash
# Accéder à PostgreSQL
docker exec -it hackforhope_db psql -U hackforhope -d hackforhope_db

# Vérifier les données
SELECT * FROM users;
SELECT * FROM incidents;
\q
```

### 3. Répartir le travail
Ouvrez [TASKS.md](TASKS.md) et assignez les tâches :
- Personne 2 : Backend (Auth, Users, Incidents)
- Personne 3 : Frontend (Login, Dashboard, Liste)
- Personne 4 : Features (Upload, Stats, Présentation)
- Vous (Lead) : Intégration, merge, aide debug

### 4. Créer les branches Git
```bash
# Personne 2
git checkout -b backend_auth

# Personne 3
git checkout -b frontend_pages

# Personne 4
git checkout -b features_upload
```

### 5. Commencer à coder !
Chacun dans son dossier :
- Personne 2 : `backend/src/auth/`, `backend/src/users/`, etc.
- Personne 3 : `frontend/src/app/login/`, etc.
- Personne 4 : `backend/src/uploads/`, `frontend/src/app/reports/`, etc.

---

## 💡 CONSEILS IMPORTANTS

### ✅ À FAIRE
- Commitez souvent (toutes les 30 min)
- Testez localement avant de push
- Communiquez dans le canal équipe
- Demandez de l'aide IMMÉDIATEMENT si bloqué
- Mergez sur `dev` toutes les 2-3h

### ❌ À ÉVITER
- Modifier les fichiers des autres sans prévenir
- Commiter du code qui ne compile pas
- Attendre la fin pour merger (enfer des conflits)
- Vouloir tout faire (focus MVP)
- Oublier la présentation (commencer à H12)

---

## 🔥 EN CAS DE PROBLÈME

**Backend ne démarre pas** :
```bash
docker-compose logs backend
```

**Frontend ne démarre pas** :
```bash
docker-compose logs frontend
```

**DB ne s'initialise pas** :
```bash
docker-compose logs db
```

**Tout redémarrer from scratch** :
```bash
docker-compose down -v
docker-compose up --build
```

---

## 📞 BESOIN D'AIDE ?

Lisez dans cet ordre :
1. [README.md](README.md) - Documentation générale
2. [TASKS.md](TASKS.md) - Répartition des tâches
3. Ce fichier - Explications détaillées

Bonne chance pour le hackathon ! 🚀
