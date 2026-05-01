# Heritage MTL — Notes de parcours

Site web statique pour archiver les notes de visites guidées d'Héritage Montréal et d'organismes apparentés. Chaque parcours fait l'objet d'une fiche détaillée comprenant les notes vérifiées, une carte interactive et les photographies prises sur le terrain.

Construit avec [Astro](https://astro.build), [Leaflet](https://leafletjs.com) et déployé automatiquement sur GitHub Pages.

## Aperçu de l'architecture

```
heritage-mtl-parcours/
├── .github/workflows/deploy.yml       Déploiement automatique sur GitHub Pages
├── astro.config.mjs                   Configuration Astro (base path, intégrations)
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro               En-tête du site
│   │   ├── Footer.astro               Pied de page
│   │   ├── TourMap.astro              Carte Leaflet avec routage OSRM
│   │   ├── StopsList.astro            Barre latérale des arrêts
│   │   └── PhotoGallery.astro         Galerie avec lightbox
│   ├── content/
│   │   ├── parcours/
│   │   │   └── 2026-circuit-1/
│   │   │       ├── index.mdx          Notes de parcours détaillées
│   │   │       ├── stops.json         Données structurées des arrêts
│   │   │       └── photos/            Photographies du parcours
│   │   └── content.config.ts          Schéma de validation
│   ├── layouts/
│   │   ├── BaseLayout.astro           Squelette HTML de base
│   │   └── ParcoursLayout.astro       Mise en page d'un parcours
│   ├── pages/
│   │   ├── index.astro                Page d'accueil (liste des visites)
│   │   └── parcours/[...slug].astro   Page dynamique pour chaque parcours
│   └── styles/
│       └── global.css                 Tokens de design et styles globaux
└── package.json
```

## Configuration initiale

Avant le premier déploiement, deux ajustements sont à faire dans `astro.config.mjs` selon votre configuration GitHub :

```javascript
site: 'https://VOTRE-USERNAME.github.io/heritage-mtl-parcours',
base: '/heritage-mtl-parcours/',
```

Remplacez `VOTRE-USERNAME` par votre nom d'utilisateur GitHub. Si vous renommez le dépôt, ajustez `base` en conséquence (les chemins doivent contenir le slash de fin).

Ensuite, dans les paramètres GitHub du dépôt, sous l'onglet **Pages**, sélectionnez **GitHub Actions** comme source de déploiement. Le pipeline `.github/workflows/deploy.yml` se chargera du reste à chaque `git push` sur la branche `main`.

## Développement local

```bash
npm install      # Installer les dépendances
npm run dev      # Lancer le serveur de développement (http://localhost:4321/heritage-mtl-parcours/)
npm run build    # Construire le site statique dans dist/
npm run preview  # Prévisualiser le build de production
```

Le serveur de développement recompile automatiquement à chaque modification de fichier.

## Ajouter un nouveau parcours

L'ajout d'une nouvelle visite suit toujours la même séquence en quatre étapes.

**Étape 1. Créer le dossier du parcours.** La convention de nommage est `ANNÉE-série-circuit`, ce qui donne un classement chronologique naturel et lisible. Par exemple :

```bash
mkdir -p src/content/parcours/2026-circuit-2/photos
```

**Étape 2. Créer le fichier `stops.json`.** Ce fichier définit les arrêts qui apparaîtront sur la carte interactive. Sa structure est un tableau d'objets, chacun comportant au minimum un numéro, un nom et des coordonnées géographiques. Les champs facultatifs permettent d'enrichir les info-bulles sur la carte. Voici un exemple complet :

```json
[
  {
    "num": 1,
    "name": "Nom de l'arrêt",
    "lat": 45.5098,
    "lng": -73.5561,
    "time": "10h00",
    "duration": 8,
    "type": "start",
    "desc": "Brève description visible dans l'info-bulle de la carte."
  },
  {
    "num": 2,
    "name": "Deuxième arrêt",
    "lat": 45.5087,
    "lng": -73.5553,
    "time": "10h08",
    "duration": 7,
    "desc": "Description courte."
  }
]
```

Le champ `type` accepte trois valeurs (`start`, `end`, ou rien pour les arrêts intermédiaires) et détermine la couleur du marqueur sur la carte (vert pour le départ, doré pour l'arrivée, bleu pour les autres). Pour obtenir les coordonnées d'un lieu, recherchez-le dans Google Maps, faites un clic droit, puis copiez les valeurs latitude/longitude.

**Étape 3. Créer le fichier `index.mdx`.** Ce fichier contient les notes détaillées rédigées en markdown étendu. Le bloc `frontmatter` au début (entre les deux `---`) fournit les métadonnées qui alimenteront la fiche et la page d'accueil.

```mdx
---
title: "Titre complet du parcours"
subtitle: "Sous-titre descriptif (facultatif)"
series: "Nom de la série"
circuit: "2"
date: 2026-06-15
duration: "90 minutes"
distance: "2,8 km"
stopsCount: 10
organizer: "Héritage Montréal"
summary: "Résumé de deux à trois phrases qui apparaît sur la page d'accueil."
tags:
  - vieux-montreal
  - architecture
draft: false
---

## Trame thématique

Premier paragraphe synthétisant les fils conducteurs du parcours...

## Arrêt 1. Nom de l'arrêt

Contenu détaillé de l'arrêt, en prose académique...

![Description de la photo](./photos/01-nom-arret.jpg)

## Arrêt 2. Suivant

...
```

Mettre `draft: true` empêche la page d'apparaître à la fois sur la page d'accueil et dans la liste des routes générées, ce qui est utile pour les brouillons.

**Étape 4. Ajouter les photographies.** Déposez les fichiers JPEG ou PNG dans le sous-dossier `photos/` du parcours, avec une convention de nommage `NN-mot-cle.jpg` (par exemple `01-place-montrealaises-verriere.jpg`). Référencez-les dans le `index.mdx` à l'endroit voulu, à l'aide de la syntaxe markdown standard :

```markdown
![Façade de la place des Montréalaises depuis l'emmarchement](./photos/01-place-montrealaises-verriere.jpg)
```

Astro génère automatiquement plusieurs tailles responsive de chaque image, applique le chargement différé et convertit en WebP ou AVIF selon le navigateur. Aucune action supplémentaire n'est requise pour l'optimisation.

Pour publier la nouvelle visite, faites simplement `git add`, `git commit` et `git push`. GitHub Actions détectera le commit, construira le site et déploiera la nouvelle version en quelques minutes.

## Modifier un parcours existant

Pour corriger une coquille, ajouter une photo ou enrichir une description, ouvrez le fichier `index.mdx` ou `stops.json` du parcours concerné et faites vos modifications. Le commit suivant déclenchera automatiquement un nouveau déploiement.

## Personnalisation visuelle

Tous les jetons de design (couleurs, typographies, espacements) sont définis comme variables CSS dans `src/styles/global.css`. Pour modifier l'aspect du site, ajustez les valeurs des variables `--cream`, `--accent`, `--font-display`, etc., et l'ensemble du site reflétera les changements de manière cohérente.

## Sources de données externes

Le composant `TourMap` utilise deux services externes gratuits qui ne nécessitent pas d'authentification :

Le fond cartographique provient de **CartoDB Positron**, servi gratuitement avec attribution à OpenStreetMap et CARTO. Si ce service devenait indisponible, on pourrait basculer vers d'autres tuiles compatibles en modifiant l'URL `L.tileLayer` dans `TourMap.astro`.

Le calcul du tracé piétonnier exact entre les arrêts utilise le **service public OSRM** (`router.project-osrm.org`). En cas d'indisponibilité du service, le composant bascule automatiquement vers un tracé en lignes droites entre les arrêts.

## Dépendances et maintenance

Le projet utilise des versions stables d'Astro et de ses intégrations. Pour mettre à jour les dépendances :

```bash
npm outdated     # Voir les mises à jour disponibles
npm update       # Appliquer les mises à jour mineures et de correctifs
```

Pour des mises à jour majeures (par exemple Astro 5 vers Astro 6), consulter le guide de migration officiel d'Astro avant de procéder.

## Licence

Notes de parcours et photographies sous droits d'auteur de leur autrice, sauf mention contraire. Code source du site sous licence MIT.
