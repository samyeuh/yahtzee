# Yams

## Introduction

Ce projet Github est une version du célèbre jeu de dés **"Yam's"** où le joueur cherche à obtenir le meilleur score possible en remplissant différentes catégories sur un tableau de score. Chaque partie consiste en treize tours durant lesquels le joueur lance cinq dés jusqu'à trois fois pour tenter de réaliser des combinaisons spécifiques, telles qu'un brelan, un carré, une suite, ou un Yam (cinq dés identiques).

Le joueur choisit après chaque premier et deuxième lancer quels dés garder et quels dés relancer pour optimiser ses chances de former les combinaisons désirées. Une fois une combinaison obtenue, il l'inscrit dans la catégorie correspondante sur le tableau de score. Chaque catégorie ne peut être utilisée qu'une seule fois par partie, donc la stratégie et la prise de décision sont cruciales. Le jeu se termine après le treizième tour, et le joueur calcule son score total pour évaluer sa performance.

## Technologies utilisés

**Front:** React + TypeScript + Vite
**Back:** Python + Flask

## Installation du jeu

### Clone du projet

Déplacez-vous dans le dossier où vous voulez cloner le projet.
Dans la barre de recherche écrivez :
```
git clone <lien>
```

Puis ouvrez le avec un éditeur de code compatible (VSCode, IntelliJ...).

### Installation des dépendances

Déplacez vous dans le dossier **yams** :
```
cd .\front\yams\
```

Puis installer les dépendances avec :
```
npm install
```

## Lancement du jeu

### Lancement du site

Dans le dossier **yams**, faîtes :
```
 npm run dev
```

Une **URL** s'affiche, c'est le lien du site.

### Lancement du serveur

Ouvrez un nouveau terminal sans fermer l'ancien.Allez dans le dossier **back** et faîtes :
```
python .\yams_api
```

Et après ça, allez sur le site et amusez vous bien. ☻
