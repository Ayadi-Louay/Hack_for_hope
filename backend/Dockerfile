# 🔧 BACKEND NESTJS
# Image Node.js légère basée sur Alpine Linux
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 3001
EXPOSE 3001

# Commande par défaut (surchargée dans docker-compose.yml)
CMD ["npm", "run", "start:dev"]
