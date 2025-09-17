FROM node:18-bullseye

WORKDIR /app

COPY package*.json tsconfig.json ./

# Install dependencies including devDependencies
RUN npm install --include=dev

# Install TypeScript globally so `tsc` is guaranteed to exist
RUN npm install -g typescript

COPY . .

# Build TypeScript
RUN tsc

EXPOSE 8000

CMD ["node", "dist/index.js"]
