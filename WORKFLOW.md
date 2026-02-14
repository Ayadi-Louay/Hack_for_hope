# 🔄 WORKFLOW DÉTAILLÉ - Hack for Hope

## 📋 Vue d'ensemble des 3 niveaux

```
┌─────────────────────────────────────────────────────────────────┐
│ NIVEAU 1 : DÉCLARANTS (Terrain)                                │
│ Rôles : Mères SOS, Tantes SOS, Éducateurs                      │
│ Village : Assigné à un village spécifique                      │
│ Action : Créer un signalement (anonyme ou non)                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ↓ Signalement créé
                   │
┌─────────────────────────────────────────────────────────────────┐
│ NIVEAU 2 : ANALYSTES (Traitement)                              │
│ Rôles : Psychologues, Responsables Sociaux                     │
│ Village : Assigné à un village spécifique                      │
│ Action : CLASSIFIER puis traiter selon classification          │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ↓ CLASSIFICATION (choix obligatoire)
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼───┐  ┌──▼──┐  ┌───▼────┐
    │ FAUX  │  │ P.E.C│  │SAUVEG. │
    └───┬───┘  └──┬──┘  └───┬────┘
        │         │          │
        │         │          └────► PROCÉDURE OBLIGATOIRE (6 étapes)
        │         │                 ├─ 1. Fiche initiale + DPE
        │         │                 ├─ 2. Évaluation complète
        │         └────► Simple     ├─ 3. Plan d'action
        │                traitement ├─ 4. Rapport de suivi
        │                           ├─ 5. Rapport final
        └────► Clôture              └─ 6. Avis de clôture
               immédiate                 │
                                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ NIVEAU 3 : DIRECTION (Décision finale)                         │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ Directeur National → Voit TOUS les villages               │ │
│ │ (Gammarth, Siliana, Mahres, Akouda)                       │ │
│ └───────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ 4 Directeurs Village → Chacun voit SON village uniquement │ │
│ │ (Supervision, pas de classification ni checklist)         │ │
│ └───────────────────────────────────────────────────────────┘ │
│ Action : Décision formelle + Archivage sécurisé                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏢 Architecture SOS Villages

### **4 Villages d'Enfants SOS en Tunisie** :
1. **Village Gammarth** (Nord)
2. **Village Siliana** (Nord-Ouest)
3. **Village Mahres** (Centre-Est)
4. **Village Akouda** (Centre-Est)

### **Structure hiérarchique** :

```
                    ┌─────────────────────────┐
                    │  Directeur National     │
                    │  (Bureau National)      │
                    │  Voit: TOUS les villages│
                    └──────────┬──────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
    ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
    │ Dir. Gammarth│  │ Dir. Siliana │  │ Dir. Mahres  │ ...
    │ (Niveau 3)   │  │ (Niveau 3)   │  │ (Niveau 3)   │
    └───────┬──────┘  └───────┬──────┘  └───────┬──────┘
            │                  │                  │
    ┌───────▼──────────────────▼──────────────────▼──────┐
    │           Psychologues / Responsables Sociaux      │
    │                    (Niveau 2)                      │
    │         Assignés à un village spécifique           │
    │    Classification + Checklist + Traitement         │
    └───────┬────────────────────────────────────────────┘
            │
    ┌───────▼──────────────────────────────────────────┐
    │    Déclarants : Mères, Tantes, Éducateurs       │
    │              (Niveau 1)                         │
    │      Assignés à un village spécifique           │
    │          Créent les signalements                │
    └─────────────────────────────────────────────────┘
```

---

## 🎯 NIVEAU 1 : Création du signalement

### Qui ?
- Mères SOS
- Tantes SOS
- Éducateurs/Éducatrices

### Actions possibles :
1. **Remplir le formulaire de signalement** :
   - Anonyme OU identifié
   - Type d'incident (Maltraitance, Santé, Comportement, Conflit, Autre)
   - Niveau d'urgence (Faible, Moyen, Élevé, Critique)
   - Village concerné
   - Nom de l'abuseur (optionnel)
   - Nom de l'enfant concerné (optionnel)
   - Description détaillée
   
2. **Uploader des pièces jointes** (optionnel) :
   - Photos
   - Enregistrements audio
   - Vidéos

3. **Soumettre le signalement**
   → Envoyé aux psychologues/directeurs de village du même village

### Statut initial :
- `status` = `EN_ATTENTE`
- `classification` = `NON_CLASSIFIE`

---

## 🎯 NIVEAU 2 : Classification et Traitement

### Qui ?
- **Psychologues** (assignés à un village)
- **Responsables Sociaux** (assignés à un village)

**⚠️ Important** : Les Directeurs Village sont au **Niveau 3**, ils ne font PAS la classification ni la checklist.
- Directeurs de village

### Étape 1 : CLASSIFIER le signalement (choix obligatoire)

Le psychologue/directeur doit **choisir une classification** :

#### Option A : FAUX ❌
**Signification** : Fausse alerte, aucun danger réel

**Actions** :
1. Marquer `classification` = `FAUX`
2. Ajouter un commentaire de justification
3. Changer `status` = `FAUX`
4. **Clôture immédiate** du dossier

**Pas de procédure, fin du workflow**

---

#### Option B : PRISE EN CHARGE ⚕️
**Signification** : Cas léger, problème pas dangereux, traitement simple

**Actions** :
1. Marquer `classification` = `PRISE_EN_CHARGE`
2. Changer `status` = `PRISE_EN_CHARGE`
3. **Traitement simple** :
   - Suivi psychologique régulier
   - Actions correctives simples
   - Rapports libres (pas de checklist obligatoire)
4. Quand terminé → `status` = `CLOTURE`

**Pas de procédure obligatoire, workflow flexible**

---

#### Option C : SAUVEGARDE 🚨 (LE PLUS IMPORTANT)
**Signification** : **Cas grave**, danger réel, nécessite une procédure stricte

**Actions** :
1. Marquer `classification` = `SAUVEGARDE`
2. Changer `status` = `EN_PROCEDURE`
3. **DÉCLENCHE LA PROCÉDURE OBLIGATOIRE** (checklist 6 étapes)

---

### 🔥 LA PROCÉDURE (si classification = SAUVEGARDE)

**Principe** : Checklist **BLOQUANTE** → on ne peut pas passer à l'étape suivante sans compléter l'étape précédente

#### **Étape 1 : Fiche initiale + Rapport DPE** 📄
**Objectif** : Documentation initiale + notification hiérarchique

**Actions** :
1. Télécharger le template Word : `etape1_fiche_initiale_dpe.docx`
2. Remplir :
   - Fiche de signalement détaillée
   - Rapport pour le Directeur Programme Enfance (DPE)
   - Notification au Bureau National
3. Uploader le(s) document(s) rempli(s)
4. Valider l'étape → `procedure_progress.step_1.is_completed` = TRUE

**Bloquage** : Étape 2 impossible tant que Étape 1 non complétée

---

#### **Étape 2 : Évaluation complète** 🔍
**Objectif** : Évaluation approfondie par le psychologue

**Actions** :
1. Télécharger le template : `etape2_evaluation_complete.docx`
2. Remplir :
   - Évaluation psychologique de l'enfant
   - Évaluation de l'environnement
   - Analyse des risques
   - Recommandations
3. Uploader le document rempli
4. Valider l'étape

**Bloquage** : Étape 3 impossible tant que Étape 2 non complétée

---

#### **Étape 3 : Plan d'action** 📋
**Objectif** : Définir les mesures concrètes à prendre

**Actions** :
1. Télécharger le template : `etape3_plan_action.docx`
2. Remplir :
   - Actions immédiates à prendre
   - Responsables de chaque action
   - Délais
   - Ressources nécessaires
3. Uploader le document rempli
4. Valider l'étape

**Bloquage** : Étape 4 impossible tant que Étape 3 non complétée

---

#### **Étape 4 : Rapport de suivi** 📊
**Objectif** : Suivi régulier de l'évolution

**Actions** :
1. Télécharger le template : `etape4_rapport_suivi.docx`
2. Remplir (peut être fait plusieurs fois) :
   - État d'avancement des actions
   - Évolution de la situation de l'enfant
   - Obstacles rencontrés
   - Ajustements nécessaires
3. Uploader le(s) rapport(s) de suivi
4. Valider l'étape

**Bloquage** : Étape 5 impossible tant que Étape 4 non complétée

---

#### **Étape 5 : Rapport final** 📝
**Objectif** : Bilan final de la prise en charge

**Actions** :
1. Télécharger le template : `etape5_rapport_final.docx`
2. Remplir :
   - Synthèse de toutes les actions menées
   - Résultats obtenus
   - État final de l'enfant
   - Recommandations pour la suite
3. Uploader le document rempli
4. Valider l'étape

**Bloquage** : Étape 6 impossible tant que Étape 5 non complétée

---

#### **Étape 6 : Avis de clôture** ✅
**Objectif** : Validation finale de la clôture du dossier

**Actions** :
1. Télécharger le template : `etape6_avis_cloture.docx`
2. Remplir :
   - Validation que tous les objectifs sont atteints
   - Accord pour clôturer le dossier
   - Signature(s) des responsables
3. Uploader le document rempli
4. Valider l'étape

**Résultat** : Toutes les 6 étapes complétées → Dossier prêt pour la Direction

---

### Fonctionnalités supplémentaires Niveau 2 :

#### Tableau de bord de gestion
- Liste de tous les signalements reçus
- Filtres :
  - Par statut (EN_ATTENTE, PRISE_EN_CHARGE, EN_PROCEDURE, etc.)
  - Par classification (FAUX, PRISE_EN_CHARGE, SAUVEGARDE)
  - Par village
  - Par urgence
  - Par date
- Vue de la progression de la procédure (pour les cas SAUVEGARDE)

#### Notifications temps réel
- Nouveau signalement reçu
- Signalement urgent (urgence = CRITIQUE)
- Rappel : étape de procédure en attente depuis X jours
- Escalade vers la Direction

#### Rédaction de rapports confidentiels
- Tous les documents de la procédure sont confidentiels
- Accès restreint selon le rôle
- Chiffrement des documents sensibles
- Logs d'accès (audit_logs)

---

## 🎯 NIVEAU 3 : Décision finale et Archivage

### Qui ?
- Direction du village
- Bureau national

### Actions possibles :

1. **Vue globale par village** :
   - Dashboard avec tous les incidents du village
   - Statistiques (nombre par statut, par classification)
   - Alertes (cas critiques en attente)

2. **Prise de décision formelle** :
   - Pour les cas SAUVEGARDE (procédure complète) :
     - Consulter tous les documents de la procédure
     - Prendre une décision finale :
       - Prise en charge continue
       - Sanction d'un éducateur/adulte
       - Suivi long terme
       - Autres mesures
   - Pour les cas PRISE_EN_CHARGE :
     - Validation de la clôture
     - Décisions complémentaires si nécessaire

3. **Clôture et archivage sécurisé** :
   - Changer `status` = `CLOTURE`
   - Archivage de tous les documents
   - Logs finaux (audit_logs)
   - Conservation sécurisée (RGPD)

---

## 📊 SCHÉMA DE BASE DE DONNÉES (CORRIGÉ)

### **8 tables principales** :

1. **users** : Utilisateurs (3 rôles)
2. **incidents** : Signalements avec classification
3. **attachments** : Pièces jointes (preuves + documents Word)
4. **status_history** : Historique des changements
5. **decisions** : Décisions formelles
6. **audit_logs** : Traçabilité complète
7. **procedure_templates** ✨ NOUVEAU : Templates Word pour la procédure
8. **procedure_progress** ✨ NOUVEAU : Tracking des étapes de la procédure

---

## 🔐 Règles de sécurité (RBAC + RLS)

### **5 RÔLES utilisateurs** :
1. `DECLARANT` (Niveau 1)
2. `PSYCHOLOGUE` (Niveau 2)
3. `RESPONSABLE_SOCIAL` (Niveau 2)
4. `DIRECTEUR_VILLAGE` (Niveau 3)
5. `DIRECTEUR_NATIONAL` (Niveau 3)

---

### DECLARANT (Niveau 1)
**Village** : Assigné à un village spécifique

✅ Peut :
- Créer un signalement dans son village
- Uploader des pièces jointes (preuves)
- Voir **uniquement SES propres signalements**

❌ Ne peut PAS :
- Voir les signalements des autres déclarants (même village)
- Classifier un signalement
- Accéder à la procédure
- Prendre des décisions

---

### PSYCHOLOGUE (Niveau 2)
**Village** : Assigné à un village spécifique

✅ Peut :
- Voir **tous les signalements de SON village uniquement**
- Classifier un signalement (FAUX / PRISE_EN_CHARGE / SAUVEGARDE)
- Télécharger les templates de procédure
- Uploader les documents remplis (checklist 6 étapes)
- Marquer les étapes comme complétées
- Créer des décisions

❌ Ne peut PAS :
- Voir les signalements d'autres villages
- Clôturer définitivement un cas SAUVEGARDE sans accord Direction
- Modifier les signalements d'autres villages

---

### RESPONSABLE_SOCIAL (Niveau 2)
**Village** : Assigné à un village spécifique

✅ Peut : (mêmes droits que PSYCHOLOGUE)
- Voir **tous les signalements de SON village uniquement**
- Classifier un signalement
- Gérer la checklist procédure (6 étapes)
- Créer des décisions

❌ Ne peut PAS :
- Voir les signalements d'autres villages
- Clôturer définitivement un cas SAUVEGARDE sans accord Direction

---

### DIRECTEUR_VILLAGE (Niveau 3)
**Village** : Assigné à un village spécifique (Gammarth, Siliana, Mahres, ou Akouda)

✅ Peut :
- Voir **tous les signalements de SON village uniquement**
- **Superviser le travail** des psychologues/responsables sociaux de son village
- Accéder à tous les documents de son village
- Prendre des décisions finales pour son village
- Clôturer les dossiers de son village
- Voir les statistiques de son village

❌ Ne peut PAS :
- Voir les signalements des autres villages
- Classifier les signalements (rôle des psychologues/responsables sociaux)
- Faire la checklist procédure (rôle des psychologues/responsables sociaux)

**Note** : Le directeur village est en **supervision** uniquement. Il ne fait pas le travail opérationnel (classification/checklist).

---

### DIRECTEUR_NATIONAL (Niveau 3)
**Village** : NULL (voit tous les villages)

✅ Peut : **(TOUS LES DROITS)**
- Voir **TOUS les signalements de TOUS les villages** (Gammarth, Siliana, Mahres, Akouda)
- Accéder à tous les documents
- Prendre des décisions finales globales
- Clôturer les dossiers
- Voir les statistiques nationales
- Superviser les 4 directeurs village
- Accéder aux logs d'audit complets

❌ Ne peut PAS :
- (Aucune restriction)

---

## 💾 Exemples de données

### Incident en attente de classification
```json
{
  "id": "uuid-123",
  "declarant_id": "uuid-fatma",
  "type": "MALTRAITANCE",
  "urgence": "CRITIQUE",
  "village": "Village El Menzah",
  "description": "Suspicion de maltraitance...",
  "status": "EN_ATTENTE",
  "classification": "NON_CLASSIFIE"
}
```

### Incident classifié SAUVEGARDE (procédure en cours)
```json
{
  "id": "uuid-456",
  "declarant_id": null,  // Anonyme
  "type": "MALTRAITANCE",
  "urgence": "CRITIQUE",
  "village": "Village Sousse",
  "description": "Suspicion de maltraitance...",
  "status": "EN_PROCEDURE",
  "classification": "SAUVEGARDE",
  "classified_by": "uuid-ahmed",
  "classified_at": "2026-02-15T10:30:00Z",
  "analyste_id": "uuid-ahmed"
}
```

### Progression de la procédure
```json
{
  "incident_id": "uuid-456",
  "steps": [
    {"step_number": 1, "is_completed": true, "completed_at": "2026-02-15T14:00:00Z"},
    {"step_number": 2, "is_completed": true, "completed_at": "2026-02-16T09:00:00Z"},
    {"step_number": 3, "is_completed": false},  // Étape en cours
    {"step_number": 4, "is_completed": false},  // Bloquée
    {"step_number": 5, "is_completed": false},  // Bloquée
    {"step_number": 6, "is_completed": false}   // Bloquée
  ]
}
```

---

## ✅ Résumé des changements du setup

### Avant (incomplet) :
- ❌ Pas de classification
- ❌ Pas de procédure
- ❌ Pas de checklist
- ❌ Statuts incorrects

### Après (corrigé) :
- ✅ Champ `classification` dans `incidents`
- ✅ Table `procedure_templates` (6 templates Word)
- ✅ Table `procedure_progress` (tracking des étapes)
- ✅ Statuts adaptés (EN_ATTENTE, FAUX, PRISE_EN_CHARGE, SAUVEGARDE, EN_PROCEDURE, CLOTURE)
- ✅ Table `attachments` améliorée (distingue preuves vs documents procédure)

---

## 🎯 Pour le développement

### Backend (Personne 2)
Routes à créer :
- `POST /api/incidents/:id/classify` → Classifier un incident
- `GET /api/procedure/templates` → Liste des templates Word
- `GET /api/procedure/templates/:stepNumber/download` → Télécharger un template
- `POST /api/procedure/:incidentId/step/:stepNumber/complete` → Marquer étape complétée
- `GET /api/procedure/:incidentId/progress` → Voir la progression

### Frontend (Personne 3)
Pages à créer :
- `/incidents/:id/classify` → Formulaire de classification
- `/incidents/:id/procedure` → Vue de la procédure (6 étapes)
- `/procedure/step/:stepNumber` → Détail d'une étape (télécharger + uploader)
- `/dashboard/analyst` → Dashboard analyste avec filtres

---

Workflow maintenant correct ! 🚀
