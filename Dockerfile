# Usa una imagen oficial de Node.js basada en Debian
FROM node:18-bullseye

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Instala ts-node-dev y tsconfig-paths globalmente
RUN npm install -g ts-node-dev tsconfig-paths

# Instala las bibliotecas necesarias para onnxruntime-node
RUN apt-get update && apt-get install -y \
    libc6 \
    libstdc++6 \
    libgcc1 \
    && rm -rf /var/lib/apt/lists/*

# Copia el resto del código
COPY . .

# Exponer el puerto en el contenedor
EXPOSE 3000 9229

# Inicia el servidor en modo debug y watch
CMD ["ts-node-dev", "--respawn", "--transpile-only", "--inspect=0.0.0.0:9229", "--poll", "-r", "tsconfig-paths/register", "src/app.ts"]
