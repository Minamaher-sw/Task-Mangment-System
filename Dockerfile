FROM node:18 as base

FROM base as development

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install -g nodemon 

COPY ./src /app/src
COPY index.js /app/index.js

CMD ["nodemon", "--legacy-watch", "index.js"]

FROM base as production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY ./src /app/src
COPY index.js /app/index.js

CMD [ "npm", "start" ]

# FROM node:18

# WORKDIR /app

# COPY package*.json ./

# ARG NODE_ENV

# RUN if [ '$NODE_ENV' = "production" ]; then \
#     npm install --only=production; \
#     else \
#     npm install && npm install -g nodemon; \
#     fi

# COPY ./src /app/src
# COPY index.js /app/index.js

# EXPOSE 3000

# CMD ["node", "index.js"]

