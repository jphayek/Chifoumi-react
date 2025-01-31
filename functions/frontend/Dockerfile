# Utiliser une image Node.js comme base
FROM node:18

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port du frontend
EXPOSE 3000

# Commande pour démarrer le frontend
CMD ["npm", "start"]