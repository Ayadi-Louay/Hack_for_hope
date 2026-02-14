# 📋 TASKS - Répartition du travail

## ✅ FAIT (H0-H1)

### Lead Architecture & DevOps (Personne 1)
- [x] Docker Compose setup
- [x] Base de données PostgreSQL + init.sql
- [x] Structure backend (NestJS)
- [x] Structure frontend (Next.js)
- [x] Configuration TypeScript
- [x] Configuration TailwindCSS
- [x] Documentation README.md
- [x] Variables d'environnement (.env.example)

---

## 🔄 À FAIRE (H1-H18)

### 👤 Personne 2 : Backend Core

#### H1-H4 : Auth & Users
- [ ] Entity User (TypeORM)
- [ ] DTO Login/Register
- [ ] AuthService (JWT, bcrypt)
- [ ] AuthController (routes /login, /register)
- [ ] JwtStrategy + Guards
- [ ] Module Users (CRUD basique)

#### H4-H8 : Incidents
- [ ] Entity Incident
- [ ] DTO CreateIncident, UpdateIncident
- [ ] IncidentsService (CRUD)
- [ ] IncidentsController
- [ ] Filtres par rôle (RBAC)
- [ ] Relations avec Users

#### H8-H12 : Audit & Finitions
- [ ] Entity AuditLog
- [ ] Interceptor pour logger les actions
- [ ] Tests manuels API (Postman/Thunder Client)

---

### 👤 Personne 3 : Frontend Core

#### H1-H4 : Layout & Auth
- [ ] Components : Navbar, Sidebar
- [ ] Page /login (formulaire)
- [ ] Service auth.ts (axios)
- [ ] Store Zustand (user state)
- [ ] Middleware de protection routes

#### H4-H8 : Incidents
- [ ] Page /dashboard (vue par rôle)
- [ ] Page /incidents (liste avec filtres)
- [ ] Page /incidents/new (formulaire création)
- [ ] Page /incidents/[id] (détail)
- [ ] Composant IncidentCard

#### H8-H12 : Polish UI
- [ ] Loading states
- [ ] Messages d'erreur
- [ ] Notifications toast
- [ ] Responsive mobile

---

### 👤 Personne 4 : Features & Présentation

#### H1-H6 : Upload Fichiers
- [ ] Backend : Module Uploads (Multer)
- [ ] Backend : Validation fichiers (type, taille)
- [ ] Backend : Endpoint POST /uploads
- [ ] Frontend : Composant FileUpload
- [ ] Frontend : Affichage pièces jointes

#### H6-H12 : Dashboard & Stats
- [ ] Backend : Endpoint /stats (compteurs par statut)
- [ ] Frontend : Composant StatsCard
- [ ] Frontend : Graphiques simples (Chart.js ou Recharts)
- [ ] Workflow : Boutons actions selon rôle

#### H12-H18 : PRÉSENTATION ⚠️ PRIORITÉ
- [ ] Pitch deck (PowerPoint/Canva)
- [ ] Vidéo démo 3-5 min (OBS Studio)
- [ ] Screenshots de l'app
- [ ] Script de présentation (5 min)
- [ ] Répétition pitch

---

## 🚨 CHECKPOINTS OBLIGATOIRES

### H2 : Checkpoint Setup
- [ ] Tout le monde peut lancer `docker-compose up`
- [ ] Backend accessible sur http://localhost:3001
- [ ] Frontend accessible sur http://localhost:3000
- [ ] DB avec données de test

### H8 : Checkpoint Intégration
- [ ] Login fonctionnel (front ↔ back)
- [ ] Créer un incident fonctionnel
- [ ] Liste incidents affichée
- [ ] Au moins 1 merge sur `main`

### H16 : Checkpoint Final
- [ ] Workflow complet : Créer → Analyser → Décider
- [ ] Upload fichiers OK
- [ ] Audit logs visible
- [ ] README.md à jour
- [ ] Vidéo terminée

---

## 📝 CONVENTIONS

### Git
- Branches : `nom_branch` (déjà créées)
- Commits : `feat: description` ou `fix: description`
- Merge sur `dev` toutes les 2-3h
- PR obligatoire pour merge sur `main`

### Code
- TypeScript strict
- Nommage : camelCase (variables), PascalCase (classes)
- Commentaires en français pour les parties métier
- Logs console pour debug

### API
- Préfixe : `/api`
- Authentification : Bearer Token (JWT)
- Status codes : 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)

---

## 🔥 SI ON MANQUE DE TEMPS (Plan B à partir de H12)

**Couper** :
- ❌ Dashboard fancy
- ❌ Graphiques
- ❌ Notifications temps réel
- ❌ Filtres avancés

**Garder absolument** :
- ✅ Login + 3 rôles
- ✅ CRUD Incidents
- ✅ Upload 1 fichier
- ✅ Changer statut
- ✅ Liste basique
