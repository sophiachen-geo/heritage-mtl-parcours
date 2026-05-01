---
description: Importe un parcours depuis Heptabase vers le site (stops.json + index.mdx)
argument-hint: <identifiant du circuit, p. ex. "circuit 2" ou "Au cœur de la métropole 2026, Circuit n° 2">
---

# Importer un parcours depuis Heptabase

Tu vas importer un parcours depuis Heptabase et générer les fichiers Astro correspondants.
La convention de format des cartes Heptabase est documentée dans `docs/heptabase-format.md` —
**lis ce fichier en premier** si tu ne l'as pas déjà en mémoire pour la session courante.

## Identifiant à importer

$ARGUMENTS

## Procédure

1. **Trouver les deux cartes Heptabase** correspondantes via `mcp__*__search_whiteboards`
   (mots-clés : « Carte du parcours » + numéro/nom du circuit) puis vérifier les correspondances exactes
   avec `mcp__*__semantic_search_objects` si nécessaire.

   Tu cherches deux cartes dont les titres suivent ce gabarit :
   - `Carte du parcours : <série>, Circuit n° <N>`
   - `Notes de parcours : <série>, Circuit n° <N>`

2. **Charger leur contenu complet** avec `mcp__*__get_object` (type `card`) — utilise les ids retournés
   par la recherche. Vérifie via `hasMore` que tu as bien lu toute la carte longue (Notes de parcours
   peut faire 60+ chunks).

3. **Parser la Carte du parcours** :
   - Extraire `origin`, `waypoints` (séparés par `%7C`), `destination` du lien Google Maps Directions.
   - Extraire la liste des arrêts depuis « Séquence des arrêts » (heure, durée, nom, description courte).
   - Vérifier que `1 + len(waypoints) + 1 == len(arrêts)`. Si non → arrêter et signaler la divergence.
   - Extraire `Durée totale`, `Distance approximative`, `Nombre d'arrêts` depuis « Données techniques ».

4. **Parser les Notes de parcours** :
   - Extraire `Série`, `Circuit n° N` (le texte après les deux points devient le `subtitle`),
     `Date de la visite`, `Trajet` depuis « Métadonnées du parcours ».
   - Si la date n'est pas précise (« printemps 2026 »), **demander à l'utilisateur** une date ISO avant
     de continuer.
   - Capturer la « Trame thématique ».
   - Pour chaque `## Arrêt N. <Nom>`, capturer le contenu sous `### Énoncé de la visite` et
     `### Approfondissements`. Ignorer les sous-sections « Photo » et « Liens » (ces dernières seront
     remplacées par un placeholder italique).
   - Capturer « Synthèse de la guide » et « Notes de vérification et points encore ouverts ».

5. **Composer `stops.json`** : un tableau JSON dont chaque entrée a au minimum
   `num`, `name` (nom long depuis Notes de parcours), `lat`, `lng`, `time`, `duration`, `desc` ;
   le premier arrêt reçoit `"type": "start"`, le dernier `"type": "end"`. Les arrêts intermédiaires
   n'ont pas de champ `type`.

6. **Composer `index.mdx`** avec ce frontmatter :
   ```yaml
   title: "<série>, Circuit n° <N>"
   subtitle: "<sous-titre depuis la métadonnée Circuit>"
   series: "<série>"
   circuit: "<N>"
   date: <AAAA-MM-JJ>
   duration: "<depuis Données techniques>"
   distance: "<depuis Données techniques, format ex. 1,8 km>"
   stopsCount: <nombre>
   organizer: "Héritage Montréal"
   summary: "<résumé synthétisé à partir de Trajet + Trame thématique, 2-3 phrases>"
   tags:
     - <slugs cohérents avec les tags Heptabase et le contenu>
   ```
   Puis le corps : `## Trame thématique`, séparateur `---`, chaque `## Arrêt N. <Nom>` avec ses
   sous-sections `### Énoncé de la visite`, `### Approfondissements`, `### Photo` (en
   `*Espace réservé pour photo*`), séparateurs `---`, puis `## Synthèse de la guide`,
   `## Notes de vérification et points encore ouverts`, et un paragraphe final en italique :
   ```
   *Notes de parcours rédigées à partir de la transcription audio nettoyée et vérifiées contre les
   sources patrimoniales disponibles. Les espaces photographiques sont à compléter par les images
   prises sur le terrain.*
   ```

7. **Choisir le slug** : `AAAA-circuit-N` où `AAAA` vient de la date ISO et `N` du numéro de circuit.
   Créer le dossier `src/content/parcours/<slug>/` avec `photos/.gitkeep`. Si le dossier existe déjà,
   demander confirmation avant d'écraser.

8. **Validation** : exécuter `npm run build` ; si la validation du schéma échoue ou que le build
   produit une erreur, corriger avant de continuer.

9. **Résumé final** : afficher le slug créé, la liste des arrêts (numéro + nom), le frontmatter
   généré, et un rappel à l'utilisateur d'ajouter les photos dans `photos/`. Ne pas commiter
   automatiquement — laisser l'utilisateur valider visuellement avant.
