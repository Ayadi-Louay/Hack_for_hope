# 📋 SPÉCIFICATIONS COMPLÈTES - FRONTEND SAFEGUARD

**Date :** 14 février 2026  
**Projet :** SafeGuard - Plateforme de signalement SOS Villages d'Enfants  
**Hackathon :** Hack for Hope (18h)

---

## 🎯 Vue d'ensemble

Le frontend est organisé en **3 NIVEAUX D'ACCÈS** avec des permissions strictement définies selon le rôle PostgreSQL (RLS activé).

---

## 👥 NIVEAU 1 : DÉCLARANTS

### Rôle : `DECLARANT`

### Permissions :
- ✅ Créer un signalement
- ✅ Voir leurs propres signalements uniquement
- ✅ Suivre l'état de leurs signalements
- ❌ Pas d'accès à la classification
- ❌ Pas d'accès à la checklist
- ❌ Ne voient pas les signalements des autres

### Pages accessibles :
1. **`/dashboard`** : Vue simplifiée avec liste de leurs signalements
2. **`/signalements/nouveau`** : Formulaire de création de signalement
3. **`/signalements/[id]`** : Détail d'un signalement (lecture seule)

### Fonctionnalités du formulaire de signalement :
- **Champs obligatoires :**
  - Type d'incident : MALTRAITANCE | SANTE | COMPORTEMENT | CONFLIT | AUTRE
  - Niveau d'urgence : FAIBLE | MOYEN | ELEVE | CRITIQUE
  - Village : (pré-rempli avec le village du déclarant)
  - Description détaillée (textarea)
  
- **Champs optionnels :**
  - Nom de l'enfant concerné
  - Nom de l'abuseur (si applicable)
  - Signalement anonyme (checkbox)
  - Enregistrement audio (fonctionnalité speech-to-text)
  - Pièces jointes (photos, documents)

### Dashboard déclarant :
- **Statistiques :** Nombre de signalements créés
- **Liste des signalements :** Affichage avec statut (EN_ATTENTE, PRISE_EN_CHARGE, SAUVEGARDE, etc.)
- **Filtres :** Par statut, par urgence
- **Détail :** Clic sur un signalement → voir l'avancement

---

## 👨‍⚕️ NIVEAU 2 : PSYCHOLOGUES & RESPONSABLES SOCIAUX

### Rôles : `PSYCHOLOGUE`, `RESPONSABLE_SOCIAL`

### Permissions :
- ✅ Voir tous les signalements de LEUR VILLAGE uniquement (RLS)
- ✅ Classifier les signalements (FAUX, PRISE_EN_CHARGE, SAUVEGARDE)
- ✅ Remplir la checklist de 6 étapes SI classification = SAUVEGARDE
- ✅ Dashboard temps réel avec statistiques du village
- ❌ Ne voient pas les autres villages

### Pages accessibles :
1. **`/dashboard`** : Dashboard complet avec statistiques et graphiques
2. **`/signalements`** : Liste exhaustive des signalements du village
3. **`/signalements/[id]`** : Détail avec boutons de classification
4. **`/signalements/[id]/classifier`** : Page de classification
5. **`/signalements/[id]/procedure`** : Checklist 6 étapes (si SAUVEGARDE)

### Fonctionnalité de classification :
**3 options de classification :**

#### 1️⃣ FAUX
- **Action :** Marquer comme faux signalement
- **Résultat :** Status → FAUX, incident archivé
- **Commentaire :** Obligatoire (justification)

#### 2️⃣ PRISE_EN_CHARGE
- **Action :** Suivi psychologique simple
- **Résultat :** Status → PRISE_EN_CHARGE
- **Checklist :** NON (pas de procédure de sauvegarde)
- **Commentaire :** Optionnel

#### 3️⃣ SAUVEGARDE
- **Action :** Procédure de sauvegarde complète (cas grave)
- **Résultat :** Status → SAUVEGARDE
- **Checklist :** OUI (6 étapes obligatoires)
- **Commentaire :** Obligatoire
- **Redirect :** Vers `/signalements/[id]/procedure` automatiquement

---

### 📋 CHECKLIST DE SAUVEGARDE (6 étapes)

**Déclenchée uniquement si classification = SAUVEGARDE**

#### Étape 1 : Évaluation initiale
- **Contenu :** Évaluation de la situation par le psychologue/responsable social
- **Actions :**
  - Renseigner les faits observés
  - Évaluer le niveau de danger
  - Upload document Word "Évaluation initiale.docx"
- **Validation :** Obligatoire pour passer à l'étape suivante

#### Étape 2 : Information du directeur de village
- **Contenu :** Notification automatique au directeur
- **Actions :**
  - Date/heure de l'information
  - Moyen utilisé (email, téléphone, réunion)
  - Upload document "Compte-rendu directeur.docx"
- **Validation :** Signature numérique du directeur

#### Étape 3 : Contact avec les autorités
- **Contenu :** Délégué à la protection de l'enfance / Commissariat
- **Actions :**
  - Organisme contacté
  - Nom de l'interlocuteur
  - Date et heure du contact
  - Upload document "Déclaration autorités.docx"
- **Validation :** Numéro de dossier reçu

#### Étape 4 : Mesures de protection immédiates
- **Contenu :** Actions prises pour protéger l'enfant
- **Actions :**
  - Mesures mises en place (séparation, surveillance, etc.)
  - Responsable de la mise en œuvre
  - Upload document "Mesures de protection.docx"
- **Validation :** Confirmation de mise en œuvre

#### Étape 5 : Suivi médical/psychologique
- **Contenu :** Prise en charge médicale et psychologique
- **Actions :**
  - Rendez-vous programmés
  - Professionnels impliqués
  - Upload document "Plan de suivi.docx"
- **Validation :** Calendrier établi

#### Étape 6 : Clôture et archivage
- **Contenu :** Finalisation du dossier
- **Actions :**
  - Résumé des actions menées
  - Décision finale (placement, maintien, etc.)
  - Upload document "Rapport final.docx"
- **Validation :** Signature du directeur national

**Progression :** Barre de progression visuelle (1/6, 2/6, etc.)  
**Statut incident :** Passe à EN_PROCEDURE pendant la checklist, puis CLOTURE à la fin

---

### Dashboard Psychologue/Responsable Social :

#### Statistiques en temps réel :
- **Total signalements du village**
- **En attente de classification** (badge rouge)
- **En cours de traitement** (PRISE_EN_CHARGE + SAUVEGARDE + EN_PROCEDURE)
- **Clôturés** (CLOTURE + FAUX)
- **Urgences critiques** (badge rouge clignotant)

#### Graphiques :
- **Répartition par type** (Pie chart : MALTRAITANCE, SANTE, COMPORTEMENT, etc.)
- **Évolution temporelle** (Line chart : signalements par mois)
- **Statuts actuels** (Bar chart : EN_ATTENTE, PRISE_EN_CHARGE, SAUVEGARDE, etc.)
- **Urgences** (Donut chart : FAIBLE, MOYEN, ELEVE, CRITIQUE)

#### Liste des signalements :
- **Affichage :** Cards avec aperçu
- **Tri :** Par date (récent en premier), par urgence, par statut
- **Filtres :** Type, urgence, statut, date
- **Actions rapides :** Bouton "Classifier" sur chaque card

---

## 👔 NIVEAU 3 : DIRECTEURS

### 3A - DIRECTEUR DE VILLAGE

#### Rôle : `DIRECTEUR_VILLAGE`

#### Permissions :
- ✅ Voir tous les signalements de SON VILLAGE (RLS)
- ✅ Dashboard de supervision
- ✅ Valider les étapes de la checklist (signature)
- ❌ NE PEUT PAS remplir la checklist (réservé aux psychologues/responsables sociaux)
- ❌ NE PEUT PAS classifier les signalements

#### Pages accessibles :
1. **`/dashboard`** : Dashboard de supervision du village
2. **`/signalements`** : Liste de tous les signalements du village
3. **`/signalements/[id]`** : Détail complet (lecture seule)
4. **`/signalements/[id]/procedure`** : Voir la checklist en cours (validation uniquement)
5. **`/rapports`** : Générer des rapports mensuels

#### Dashboard Directeur Village :
- **Statistiques village :**
  - Total signalements
  - En attente (nécessitent classification)
  - En cours de traitement
  - Urgences non traitées
  - Taux de clôture (% résolu)
  
- **Graphiques :**
  - Répartition par type
  - Performance de l'équipe (temps moyen de traitement)
  - Évolution mensuelle
  
- **Alertes :**
  - Signalements critiques non classifiés
  - Checklists en attente de validation
  - Délais dépassés

#### Vue checklist (lecture + validation) :
- **Affichage :** Toutes les 6 étapes avec statut
- **Actions :** Bouton "Valider l'étape" (signature numérique)
- **Historique :** Qui a rempli quoi et quand

---

### 3B - DIRECTEUR NATIONAL

#### Rôle : `DIRECTEUR_NATIONAL`

#### Permissions :
- ✅ Voir TOUS les signalements de TOUS les villages (RLS permet tout)
- ✅ Dashboard global national
- ✅ Rapports consolidés
- ✅ Statistiques comparatives entre villages
- ❌ NE PEUT PAS classifier
- ❌ NE PEUT PAS remplir la checklist

#### Pages accessibles :
1. **`/dashboard`** : Dashboard national global
2. **`/signalements`** : Liste de TOUS les signalements (tous villages)
3. **`/signalements/[id]`** : Détail complet (lecture seule)
4. **`/villages`** : Comparatif entre les 4 villages
5. **`/rapports`** : Rapports nationaux (PDF)

#### Dashboard Directeur National :

##### Vue globale :
- **Total signalements nationaux**
- **Par village :** Gammarth, Siliana, Mahres, Akouda
- **Urgences nationales** (badge alerte)
- **Checklists en cours** (SAUVEGARDE + EN_PROCEDURE)
- **Taux de résolution national** (%)

##### Graphiques avancés :
- **Carte des villages** : Heatmap avec intensité des signalements
- **Comparatif villages** : Bar chart (signalements par village)
- **Timeline nationale** : Évolution sur 12 mois
- **Types d'incidents** : Répartition nationale
- **Performance équipes** : Temps moyen de traitement par village

##### Alertes critiques :
- **Villages en difficulté** (taux de résolution < 50%)
- **Urgences non traitées depuis > 48h**
- **Checklists bloquées**

##### Rapports téléchargeables :
- **Rapport mensuel national** (PDF)
- **Rapport par village** (PDF)
- **Export Excel** : Données brutes pour analyse

---

## 🎨 THÈME & DESIGN (depuis PDF)

### Palette de couleurs :
- **Primaire :** Bleu SOS Villages (#0066CC)
- **Secondaire :** Vert (succès) #22C55E, Orange (alerte) #F59E0B, Rouge (urgence) #EF4444
- **Neutre :** Gris (#6B7280, #F3F4F6, #1F2937)
- **Fond :** Blanc #FFFFFF, Gris clair #F9FAFB

### Typographie :
- **Titre :** Inter Bold / Semi-Bold
- **Corps :** Inter Regular
- **Taille base :** 16px

### Composants UI :
- **Cards :** Shadow-lg, rounded-xl, padding généreux
- **Boutons :** Rounded-lg, shadow-md, hover effects
- **Badges :** Rounded-full, couleurs selon statut
- **Graphiques :** Chart.js ou Recharts avec couleurs cohérentes
- **Icons :** Lucide React (déjà installé)

### Layout :
- **Sidebar :** Navigation persistante (gauche)
- **Header :** User info + village + déconnexion (droite)
- **Main :** Contenu central avec max-width 7xl
- **Responsive :** Mobile-first (Tailwind)

---

## 📱 PAGES À DÉVELOPPER

### Page commune à tous :
- ✅ `/login` : Formulaire de connexion

### Pages par niveau :

#### DÉCLARANTS :
1. `/dashboard` : Vue simplifiée mes signalements
2. `/signalements/nouveau` : Formulaire création
3. `/signalements/[id]` : Détail signalement (read-only)

#### PSYCHOLOGUES & RESPONSABLES SOCIAUX :
1. `/dashboard` : Dashboard complet
2. `/signalements` : Liste complète village
3. `/signalements/[id]` : Détail + classification
4. `/signalements/[id]/classifier` : Page classification
5. `/signalements/[id]/procedure` : Checklist 6 étapes

#### DIRECTEURS VILLAGE :
1. `/dashboard` : Dashboard supervision village
2. `/signalements` : Liste village
3. `/signalements/[id]` : Détail (read-only)
4. `/signalements/[id]/procedure` : Checklist (validation)
5. `/rapports` : Génération rapports

#### DIRECTEUR NATIONAL :
1. `/dashboard` : Dashboard national
2. `/signalements` : Liste tous villages
3. `/signalements/[id]` : Détail (read-only)
4. `/villages` : Comparatif villages
5. `/rapports` : Rapports nationaux

---

## 🔐 SÉCURITÉ FRONTEND

### Protection des routes :
- **Middleware Next.js** : Vérifier JWT dans localStorage
- **Redirect si non connecté** : → `/login`
- **Affichage conditionnel** : Selon `user.role`

### Permissions UI :
```typescript
// Exemple
if (user.role === 'DECLARANT') {
  // Cacher bouton "Classifier"
  // Cacher checklist
  // Afficher uniquement formulaire + liste perso
}

if (user.role === 'PSYCHOLOGUE' || user.role === 'RESPONSABLE_SOCIAL') {
  // Afficher bouton "Classifier"
  // Afficher checklist si SAUVEGARDE
  // Dashboard complet
}

if (user.role === 'DIRECTEUR_VILLAGE') {
  // Cacher bouton "Classifier"
  // Afficher checklist en lecture + validation
  // Dashboard supervision
}

if (user.role === 'DIRECTEUR_NATIONAL') {
  // Vue globale tous villages
  // Dashboard national
  // Rapports consolidés
}
```

### Validation backend :
- **Toujours vérifier côté serveur** : Frontend = UI, Backend = source de vérité
- **RLS PostgreSQL** : Filtre automatiquement les données
- **Guards NestJS** : Protègent les endpoints

---

## 🚀 ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

### Phase 1 : Authentification (30 min)
1. Page `/login` avec formulaire
2. Stockage JWT dans localStorage
3. Middleware de protection des routes
4. Axios interceptor (Authorization header)

### Phase 2 : Layout commun (30 min)
1. Sidebar navigation (conditionnel selon rôle)
2. Header avec user info
3. Composant Card réutilisable
4. Composant Badge statut

### Phase 3 : DÉCLARANTS (1h)
1. Dashboard simple
2. Formulaire de signalement (avec audio + upload)
3. Page détail signalement

### Phase 4 : PSYCHOLOGUES/RESPONSABLES SOCIAUX (2h)
1. Dashboard avec statistiques
2. Liste signalements avec filtres
3. Page classification (3 boutons)
4. Checklist 6 étapes (si SAUVEGARDE)

### Phase 5 : DIRECTEURS (1h30)
1. Dashboard supervision (village)
2. Dashboard national (directeur national)
3. Vue checklist (validation)
4. Page rapports

### Phase 6 : Polissage (1h)
1. Graphiques Chart.js
2. Animations et transitions
3. Responsive mobile
4. Tests end-to-end

**Temps total estimé :** 6-7 heures

---

## 📊 DONNÉES TEMPS RÉEL

### Stratégie de rafraîchissement :
- **Polling :** Requête API toutes les 10 secondes (dashboard)
- **Optimistic updates :** Mettre à jour UI immédiatement, puis confirmer
- **WebSockets (optionnel)** : Si temps disponible, pour notifications push

### Endpoints API utilisés :
```typescript
// Authentification
POST /api/auth/login
GET  /api/auth/me

// Incidents
GET  /api/incidents (RLS appliqué)
GET  /api/incidents/:id
POST /api/incidents
PATCH /api/incidents/:id/classify

// Procédures (à implémenter)
GET  /api/incidents/:id/procedures
POST /api/incidents/:id/procedures/:stepNumber/complete
POST /api/incidents/:id/procedures/:stepNumber/upload

// Statistiques (à implémenter)
GET /api/statistics/village/:villageId
GET /api/statistics/national
```

---

## ✅ CHECKLIST FINALE

Avant de livrer :
- [ ] Login fonctionnel (JWT)
- [ ] 3 niveaux d'accès respectés
- [ ] Dashboard temps réel
- [ ] Formulaire signalement complet
- [ ] Classification 3 options
- [ ] Checklist 6 étapes (SAUVEGARDE)
- [ ] RLS vérifié (users voient seulement leur périmètre)
- [ ] Responsive mobile
- [ ] Thème PDF respecté
- [ ] Tous les rôles testés

---

**Document préparé le :** 14 février 2026, 22:00  
**Prêt pour développement :** ✅ OUI  
**Backend opérationnel :** ✅ Testé et validé (19/22 tests passés)
