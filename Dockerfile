# Étape 1 : Build de l'app avec Node
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx pour les fichiers statiques
FROM nginx:alpine

# Copie le build dans le dossier public de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie une config nginx custom (facultatif)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
