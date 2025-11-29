# ###############################
# # Base image (development env)
# ###############################
# FROM node:18-alpine AS base
# WORKDIR /app

# ################################
# # Development Stage
# ################################
# FROM base AS development

# # Copy only package.json first (better caching)
# COPY package.json ./

# # Install ALL dependencies (dev + prod)
# RUN npm install

# # Install nodemon for development only
# RUN npm install -g nodemon

# # Copy source code
# COPY ./src /app/src
# COPY index.js /app/index.js

# CMD ["nodemon", "--legacy-watch", "index.js"]


# ################################
# # Production Dependencies
# ################################
# FROM base AS deps

# COPY package.json ./

# # Install ONLY production dependencies
# RUN npm install --production


# ################################
# # Final Production Image
# ################################
# FROM node:18-alpine AS production

# WORKDIR /app

# COPY package.json ./
# COPY --from=deps /app/node_modules ./node_modules

# # Copy source code (same paths you use)
# COPY ./src /app/src
# COPY index.js /app/index.js

# ENV NODE_ENV=production

# CMD ["node", "index.js"]
# ###############################
###############################
# Base image
###############################
FROM node:18-alpine AS base
WORKDIR /app

ARG BUILD_ENV=development
ENV NODE_ENV=$BUILD_ENV

COPY package.json ./

###############################
# Install Dependencies (dev or prod)
###############################
FROM base AS installer

# If production → install only production deps
# If development → install everything
RUN if [ "$NODE_ENV" = "production" ]; then \
        npm install --production; \
    else \
        npm install; \
    fi

###############################
# Final Image
###############################
FROM node:18-alpine AS final
WORKDIR /app

COPY package.json ./
COPY --from=installer /app/node_modules ./node_modules

COPY ./src /app/src
COPY index.js /app/index.js

CMD ["node", "index.js"]
