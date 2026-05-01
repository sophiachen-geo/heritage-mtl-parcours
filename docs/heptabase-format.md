# Format des cartes Heptabase pour l'importation automatique

Ce document décrit la convention à suivre lors de la création des cartes Heptabase pour qu'elles puissent être importées automatiquement vers le site via la commande `/import-parcours`. Toute déviation par rapport à ce format peut bloquer le parser.

Chaque parcours est représenté dans Heptabase par **deux cartes** :

1. `Carte du parcours : <série>, Circuit n° <N>` — version condensée, source des coordonnées et des métadonnées chiffrées.
2. `Notes de parcours : <série>, Circuit n° <N>` — version longue, source du texte des arrêts.

Les titres doivent correspondre exactement à cette structure pour que la recherche par mots-clés fonctionne.

## Carte du parcours (version condensée)

Sections obligatoires, dans cet ordre, identifiées par leur titre `## …`.

### Aperçu visuel du parcours

Texte libre, ignoré par le parser.

### Itinéraire interactif

Doit contenir un lien Markdown unique vers Google Maps Directions, au format :

```
https://www.google.com/maps/dir/?api=1&origin=LAT,LNG&destination=LAT,LNG&waypoints=LAT,LNG%7CLAT,LNG…&travelmode=walking
```

Le parser extrait `origin` (premier arrêt), les `waypoints` séparés par `%7C` (arrêts intermédiaires), et `destination` (dernier arrêt). L'ordre dans l'URL doit correspondre à l'ordre des arrêts. Le nombre total de coordonnées (origin + waypoints + destination) doit être égal au nombre d'arrêts énumérés sous « Séquence des arrêts ».

Une phrase qui suit le lien peut indiquer la distance approximative (`Distance approximative à pied : X,Y kilomètre.`) — cette valeur est extraite pour le frontmatter `distance`.

### Séquence des arrêts

Une ligne par arrêt, dans l'ordre, au format strict :

```
**HHhMM, durée N min** — [Nom de l'arrêt](url google maps optionnelle). Description courte.
```

Notes :
- Variantes acceptées pour l'heure : `17h30`, `17 h 30`, `17 h30`.
- Variantes acceptées pour la durée : `durée 8 min`, `durée 8 minutes`.
- Si le nom n'a pas de lien Google Maps (cas où on n'a pas trouvé de `place_id`), il est écrit en texte brut : `Deuxième maison de faubourg.`
- La description courte est tout ce qui suit le point qui termine le nom (ou le lien). Elle alimente le champ `desc` dans `stops.json` et apparaît dans l'info-bulle de la carte Leaflet.

### Données techniques du parcours

Tableau (ou liste) avec ces clés exactes : `Durée totale`, `Distance approximative`, `Mode`, `Heure de début indicative`, `Heure de fin indicative`, `Nombre d'arrêts`. Ces valeurs alimentent le frontmatter (`duration`, `distance`, `stopsCount`).

### Liens

Section ignorée par le parser (références internes Heptabase).

## Notes de parcours (version longue)

Sections obligatoires.

### Métadonnées du parcours

Liste de paires `**Clé** : valeur` (un paragraphe par clé). Clés reconnues :

- `Série` — alimente `series` dans le frontmatter (la première portion avant la virgule, ex. « Au cœur de la métropole »).
- `Circuit n° N` — la valeur après les deux points sert de `subtitle`.
- `Durée` — surclassé par les Données techniques de la Carte si présent.
- `Date de la visite` — texte libre, mais doit contenir une date ISO (`AAAA-MM-JJ`) ou un mois reconnaissable. Si seule une saison est indiquée (« printemps 2026 »), une date de remplissage doit être fournie au moment de l'import.
- `Trajet` — alimente la base du `summary` de frontmatter.
- `Source primaire`, `Sources secondaires` — ignorées par le parser.

### Trame thématique

Texte libre, copié tel quel sous la section `## Trame thématique` du fichier `index.mdx`.

### Arrêts

Pour chaque arrêt, dans l'ordre, exactement :

```
## Arrêt N. <Nom de l'arrêt>

### Énoncé de la visite

<corps>

### Approfondissements

<corps>

### Photo

Espace réservé pour photo

### Liens

[[…]] [[…]]

---
```

Le parser :
- utilise le `<Nom de l'arrêt>` ici (plutôt que celui de la carte condensée) pour le titre de l'arrêt dans `index.mdx`,
- copie intégralement « Énoncé de la visite » et « Approfondissements »,
- remplace « Photo » par un placeholder italique avec **description spécifique** déduite du contenu de l'arrêt (ex. `*Espace réservé pour photo de la façade Beaux-Arts et des sculptures de Cérès et Hermès*`). Pas de placeholder générique,
- ignore « Liens ».

L'ordre des arrêts doit correspondre exactement à l'ordre des coordonnées dans la Carte du parcours et à l'ordre dans la Séquence des arrêts.

### Synthèse de la guide

Section libre, copiée telle quelle dans `index.mdx`.

### Notes de vérification et points encore ouverts

Section libre, copiée telle quelle dans `index.mdx`.

## Mappage final vers le site

| Source Heptabase | Cible site |
|---|---|
| Carte — `origin`, `waypoints`, `destination` | `stops.json` (lat/lng par numéro d'arrêt) |
| Carte — Séquence des arrêts | `stops.json` (time, duration, desc) + premier/dernier arrêt marqués `type: "start"` / `type: "end"` |
| Notes — Métadonnées (Série, Circuit) | frontmatter `series`, `circuit`, `subtitle` |
| Notes — Date de la visite | frontmatter `date` |
| Notes — Métadonnées (Trajet) + tags | frontmatter `summary`, `tags` |
| Carte — Données techniques | frontmatter `duration`, `distance`, `stopsCount` |
| Notes — Trame thématique | corps `index.mdx` |
| Notes — Arrêts (Énoncé + Approfondissements) | corps `index.mdx` |
| Notes — Synthèse + Notes de vérification | corps `index.mdx` |

Les photos restent à téléverser manuellement après l'import dans `src/content/parcours/<slug>/photos/`.
