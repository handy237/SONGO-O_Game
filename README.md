# 🎲 Songo – Jeu de semailles (version  local et distante)

## Auteur

Tchuessi Handji Françoise Arielle  24F2782
Étudiante en informatique – Université de Yaoundé I
Projet réalisé dans le cadre de mon apprentissage Programmation web.


## 📝 Description

Ce projet est une implémentation en local et ligne du jeu traditionnel Songo (variante Ekang), jouable à deux joueurs sur des machines différentes.  
La version actuelle est une application web complète avec :
- un frontend en HTML/CSS/JS (interface rose, responsive),
- un backend en Node.js + Express,
- une communication Ajax (fetch) pour synchroniser les deux joueurs,
- un stockage de l’état du jeu en mémoire (partagé entre les clients).

Les règles implémentées : semis dans l’ordre horaire, prise simple, fin de partie automatique.

---

## 🚀 Fonctionnalités

- Plateau de 2 × 7 cases, chaque case contient initialement 5 graines.
- Joueurs : Nord (rangée du haut) et Sud (rangée du bas).
- Ordre de semis unique et horaire (liste prédéfinie).
- Prise de graines : une case adverse contenant 2, 3 ou 4 graines après le dernier dépôt est prise (sauf première case adverse sans tour complet).
- Fin de partie : quand un joueur atteint 40 graines ou qu’il reste moins de 10 graines sur le plateau.
- Interface moderne, couleur rose, adaptée aux mobiles.
- Rafraîchissement automatique toutes les 1,5 secondes pour les deux joueurs.

---

## 🛠️ Technologies utilisées

| Couche         | Technologie                   |
|----------------|-------------------------------|
| Frontend       | HTML5, CSS3, JavaScript (ES6) |
| Backend        | Node.js + Express             |
| Communication  | Ajax (Fetch API)              |
| Serveur        | Railway (hébergement)         |
| Versionnement  | Git + GitHub                  |



## 📦 Installation en local

1. Cloner le dépôt
   `bash
   git clone https://github.com/TON_COMPTE/SONGO-O_Game.git
   cd SONGO-O_Game

   Démo en ligne

Le jeu est hébergé sur Railway :
👉  songo-ogame-production.up.railway.app



## 🎮 Comment jouer

· Joueur Nord clique sur une case de sa rangée (celle du haut).
· Joueur Sud clique sur une case de sa rangée (celle du bas).
· Le tour passe automatiquement après chaque coup.
· Les prises sont affichées dans le message d’information.
· Le bouton Nouvelle partie réinitialise complètement le plateau.