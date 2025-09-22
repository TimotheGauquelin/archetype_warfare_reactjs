# Utilisation de l'image Node.js LTS
FROM node:20-alpine

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Construction de l'application
RUN npm run build

# Utilisation de Nginx pour servir l'application
FROM nginx:alpine

# Copie des fichiers construits
COPY --from=0 /app/build /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"] 