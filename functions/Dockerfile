# Utiliser une image Node.js comme base
FROM node:14

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 3002
EXPOSE 3002

# Commande pour lancer le serveur
CMD ["node", "server.js"]