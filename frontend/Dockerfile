# 1️⃣ Use Node 18 as base image
FROM node:18

# 2️⃣ Set working directory inside container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json for dependency install
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy all frontend source code
COPY . .

# 6️⃣ Build the Vite frontend (creates dist folder)
RUN npm run build

# 7️⃣ Install serve globally to host the static files
RUN npm install -g serve

# 8️⃣ Expose port 5173
EXPOSE 5173

# Serve the production build
CMD ["serve", "-s", "dist", "-l", "5173"]
