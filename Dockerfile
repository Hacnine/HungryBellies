# Build stage for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend/web
COPY frontend/web/package*.json ./
RUN npm ci
COPY frontend/web/ ./
RUN npm run build

# Build stage for API
FROM node:18-alpine AS api-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./

# Final stage
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/frontend/web/dist ./frontend/web/dist

# Copy API
COPY --from=api-build /app/backend ./backend
WORKDIR /app/backend

EXPOSE 4000

CMD ["npm", "start"]
