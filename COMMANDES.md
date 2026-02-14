# 🚀 COMMANDES RAPIDES - Hack for Hope

## 📦 Démarrage du projet

### 1. Démarrer tous les services (première fois)
```bash
docker-compose up --build
```

### 2. Démarrer (après première build)
```bash
docker-compose up
```

### 3. Arrêter
```bash
docker-compose down
```

### 4. Tout supprimer (base de données incluse)
```bash
docker-compose down -v
```

---

## 🗄️ Accès PostgreSQL

### Connexion psql
```bash
docker exec -it hack_for_hope_db psql -U postgres -d sos_incidents
```

### Vérifier les tables
```sql
\dt
```

### Vérifier les utilisateurs créés
```sql
SELECT email, role, village_assigned FROM users ORDER BY role, village_assigned;
```

### Vérifier RLS actif
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### Voir les politiques RLS
```sql
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

---

## 🧪 Tester l'isolation RLS

### Test 1 : Psychologue Gammarth (voit 1 incident)
```sql
-- Set utilisateur
SET app.current_user_id = (SELECT id FROM users WHERE email = 'psychologue.gammarth@sos.tn');

-- Lister incidents
SELECT id, village, type, status FROM incidents;
-- Résultat attendu : 1 incident (Village Gammarth uniquement)

-- Reset
RESET app.current_user_id;
```

### Test 2 : Directeur National (voit tout)
```sql
-- Set utilisateur
SET app.current_user_id = (SELECT id FROM users WHERE email = 'directeur.national@sos.tn');

-- Lister incidents
SELECT id, village, type, status FROM incidents;
-- Résultat attendu : 3 incidents (Gammarth + Siliana + Mahres)

-- Reset
RESET app.current_user_id;
```

### Test 3 : Déclarant (voit ses signalements)
```sql
-- Set utilisateur
SET app.current_user_id = (SELECT id FROM users WHERE email = 'declarant.gammarth@sos.tn');

-- Lister incidents
SELECT id, village, declarant_id, status FROM incidents;
-- Résultat attendu : 1 incident (son propre signalement)

-- Reset
RESET app.current_user_id;
```

### Test 4 : Directeur Village Gammarth (voit son village)
```sql
-- Set utilisateur
SET app.current_user_id = (SELECT id FROM users WHERE email = 'directeur.gammarth@sos.tn');

-- Lister incidents
SELECT id, village, type, status FROM incidents;
-- Résultat attendu : 1 incident (Village Gammarth uniquement)

-- Reset
RESET app.current_user_id;
```

---

## 👥 Comptes de test

Tous les mots de passe : `password123`

### Niveau 3 : Direction
```
directeur.national@sos.tn  → Voit TOUS les villages
directeur.gammarth@sos.tn  → Voit Village Gammarth
directeur.siliana@sos.tn   → Voit Village Siliana
directeur.mahres@sos.tn    → Voit Village Mahres
directeur.akouda@sos.tn    → Voit Village Akouda
```

### Niveau 2 : Analystes (font la checklist)
```
psychologue.gammarth@sos.tn    → Village Gammarth
psychologue.siliana@sos.tn     → Village Siliana
resp.social.mahres@sos.tn      → Village Mahres
resp.social.akouda@sos.tn      → Village Akouda
```

### Niveau 1 : Déclarants
```
declarant.gammarth@sos.tn  → Village Gammarth
declarant.siliana@sos.tn   → Village Siliana
```

---

## 🔍 Debugging

### Vérifier les logs backend
```bash
docker logs hack_for_hope_backend -f
```

### Vérifier les logs frontend
```bash
docker logs hack_for_hope_frontend -f
```

### Vérifier les logs PostgreSQL
```bash
docker logs hack_for_hope_db -f
```

### Redémarrer un service spécifique
```bash
# Backend uniquement
docker-compose restart backend

# Frontend uniquement
docker-compose restart frontend

# PostgreSQL uniquement
docker-compose restart db
```

---

## 🔧 Commandes utiles PostgreSQL

### Compter les utilisateurs par rôle
```sql
SELECT role, COUNT(*) 
FROM users 
GROUP BY role 
ORDER BY role;
```

### Compter les incidents par village
```sql
SELECT village, COUNT(*) 
FROM incidents 
GROUP BY village 
ORDER BY village;
```

### Compter les incidents par statut
```sql
SELECT status, COUNT(*) 
FROM incidents 
GROUP BY status 
ORDER BY status;
```

### Voir la progression de la procédure
```sql
SELECT 
    i.village,
    i.status,
    pp.step_number,
    pp.is_completed,
    pp.completed_at
FROM incidents i
JOIN procedure_progress pp ON i.id = pp.incident_id
WHERE i.classification = 'SAUVEGARDE'
ORDER BY pp.step_number;
```

---

## 📝 Backend NestJS

### Créer un nouveau module
```bash
docker exec -it hack_for_hope_backend npm run nest g module <nom>
```

### Créer un nouveau service
```bash
docker exec -it hack_for_hope_backend npm run nest g service <nom>
```

### Créer un nouveau controller
```bash
docker exec -it hack_for_hope_backend npm run nest g controller <nom>
```

### Installer une dépendance
```bash
docker exec -it hack_for_hope_backend npm install <package>
```

---

## 🎨 Frontend Next.js

### Créer une nouvelle page
```bash
# Créer frontend/src/app/<nom>/page.tsx
```

### Installer une dépendance
```bash
docker exec -it hack_for_hope_frontend npm install <package>
```

---

## 🗃️ Backup & Restore

### Backup base de données
```bash
docker exec hack_for_hope_db pg_dump -U postgres sos_incidents > backup.sql
```

### Restore base de données
```bash
cat backup.sql | docker exec -i hack_for_hope_db psql -U postgres -d sos_incidents
```

---

## 🔒 Tests de sécurité

### Test tentative d'accès non autorisé
```sql
-- Psychologue Gammarth essaie d'accéder à incident Siliana
SET app.current_user_id = (SELECT id FROM users WHERE email = 'psychologue.gammarth@sos.tn');

-- Tentative de lire incident Siliana
SELECT * FROM incidents WHERE village = 'Village Siliana';
-- Résultat attendu : 0 résultats (RLS bloque)

-- Tentative de UPDATE incident Siliana
UPDATE incidents SET status = 'CLOTURE' WHERE village = 'Village Siliana';
-- Résultat attendu : 0 lignes modifiées (RLS bloque)

RESET app.current_user_id;
```

### Test contrainte village_assigned
```sql
-- Tentative de créer un PSYCHOLOGUE sans village (doit échouer)
INSERT INTO users (email, password_hash, nom, prenom, role, village_assigned)
VALUES ('test@sos.tn', 'hash', 'Test', 'User', 'PSYCHOLOGUE', NULL);
-- Erreur attendue : CHECK constraint violated

-- Tentative de créer un DIRECTEUR_NATIONAL avec village (doit échouer)
INSERT INTO users (email, password_hash, nom, prenom, role, village_assigned)
VALUES ('test@sos.tn', 'hash', 'Test', 'User', 'DIRECTEUR_NATIONAL', 'Village Test');
-- Erreur attendue : CHECK constraint violated
```

---

## 📊 Statistiques

### Dashboard Directeur National
```sql
SELECT 
    village,
    COUNT(*) as total_incidents,
    COUNT(*) FILTER (WHERE status = 'EN_ATTENTE') as en_attente,
    COUNT(*) FILTER (WHERE status = 'PRISE_EN_CHARGE') as prise_en_charge,
    COUNT(*) FILTER (WHERE status = 'SAUVEGARDE') as sauvegarde,
    COUNT(*) FILTER (WHERE status = 'CLOTURE') as cloture
FROM incidents
GROUP BY village
ORDER BY village;
```

### Dashboard Directeur Village
```sql
-- Pour Gammarth par exemple
SET app.current_user_id = (SELECT id FROM users WHERE email = 'directeur.gammarth@sos.tn');

SELECT 
    status,
    classification,
    COUNT(*) as total
FROM incidents
GROUP BY status, classification
ORDER BY status;

RESET app.current_user_id;
```

---

## 🆘 Problèmes fréquents

### Port 5432 déjà utilisé
```bash
# Trouver le processus
netstat -ano | findstr :5432

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F

# Ou changer le port dans docker-compose.yml
ports:
  - "5433:5432"  # Utiliser 5433 au lieu de 5432
```

### Erreur "permission denied for table incidents"
```
Cause : app.current_user_id pas set
Solution : Vérifier que le middleware Auth set app.current_user_id
```

### Base de données ne se crée pas
```bash
# Vérifier les logs
docker logs hack_for_hope_db

# Recréer les volumes
docker-compose down -v
docker-compose up --build
```

---

## 📚 Documentation

- **README.md** : Vue d'ensemble
- **WORKFLOW.md** : Workflow détaillé (5 rôles, classification, procédure)
- **SECURITY_RLS.md** : Guide RLS pour backend
- **CHANGELOG_SECURITY.md** : Historique des modifications
- **RESUME_MODIFICATIONS.md** : Résumé exécutif
- **TASKS.md** : Répartition des tâches (4 personnes)
- **SETUP_EXPLICATIONS.md** : Explications techniques

---

🚀 **Bon hackathon !**
