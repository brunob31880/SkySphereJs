# SkySphereJS

SkySphereJS est une application permettant de visualiser le ciel étoilé en fonction de la position de l'utilisateur et du temps. 

![skyspherejs](./doc/skyspherejs.png)

L'utilisateur peut basculer entre deux représentations : équatoriale et horizontale.

Le projet est en chantier

## Fonctionnalités

- **Visualisation du ciel étoilé** : L'application affiche les étoiles sur une sphère céleste virtuelle.
- **Bascule entre les coordonnées** : L'utilisateur peut choisir de visualiser le ciel en coordonnées équatoriales ou horizontales.
- **Rotation automatique** : Le ciel étoilé tourne automatiquement en fonction du temps sidéral local.

## Installation

### Prérequis

- Node.js et npm installés sur votre machine.

### Étapes d'installation

1. Clonez le dépôt :

```bash
git clone [URL_DU_DEPOT]
```

2. Naviguez dans le dossier du projet :

```bash
cd chemin_du_dossier
```

3. Installez les dépendances :

```bash
nvm use 16
```

```bash
npm install
```

4. Démarrez l'application :

```bash
npm start
```

Votre application devrait maintenant être accessible à l'adresse `http://localhost:3000`.

## Utilisation

1. Ouvrez l'application dans votre navigateur.
2. Utilisez le menu latéral pour basculer entre les représentations équatoriales et horizontales.
3. Observez le ciel étoilé se déplacer en temps réel.


## Appendice Technique: Repère Three.js

Dans le cadre du projet SkySphereJS, nous utilisons le repère standard de Three.js pour la représentation tridimensionnelle. Dans ce repère :

- L'axe \( X \) (rouge) va vers la droite.
- L'axe \( Y \) (vert) va vers le haut.
- L'axe \( Z \) (bleu) vient vers nous.

![Repère Three.js](./doc/repere.png)

**Note importante :** Initialement, le regard (ou la caméra) est dirigé vers les \( X \) croissants. C'est-à-dire que lorsque vous lancez l'application, vous regardez dans la direction où les valeurs de \( X \) augmentent.

## Contributions

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request ou me contacter via mon adresse email: boissiebruno@gmail.com

## Licence

Ce projet est sous licence MIT.



---
