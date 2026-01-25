# O multi stage building serve para deixar a imagem final mais leve  e geralmente é usado apenas em produção
# O multi stage building cria passos(stages) onde o passo 1 faz uma coisa e no passo 2 reaproveita-se o necessário do passo 1
# No nosso caso aqui, no passo 1 estamos criando um stage onde pegamos o projeto inteiro e jogamos nele (Incluindo o build), no estágio 2 basicamente estamos só reaproveitando o build que o estágio 1 fez, fazendo assim com que o nosso projeto não tenha arquivos ts, pastas desnecessárias, etc.

# ---------- STAGE 1: BUILD ----------

# Esse é o stage 1 onde estamos pegando a imagem do node 18-alpine (Que é mais leve para produção) e estamos chamando esse stage de build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# Melhor que npm install em produção
RUN npm ci

COPY . .

# Gerando o build do projeto (Que vai inclusive ser reaproveitado no stage 2), rodar o build com --production faz com que se remova coisas desnecessárias na pasta build, tais como arquivos ts e outras coisas entendidas como desnecessárias
# o --ignore-ts-errors vai ignorar erros typescript se tiver
RUN node ace build --production --ignore-ts-errors

# ---------- STAGE 2: RUNTIME ----------

# Aqui começa o stage 2, onde puxamos uma nova imagem, depois de construir essa segunda imagem, a imagem anterior é destruída (temporária)
FROM node:18-alpine

WORKDIR /app

# Apontando a variável node_env como production, justamente para ter esses benefícios como cache, algumas bibliotecas ficam ouvindo se o node_env é production ou development para tomar decisões
ENV NODE_ENV=production

# Aqui começa o que deixa tudo mais leve, estamos dizendo o seguinte: Do stage 1 que tem o nome build copia a pasta /app/build (Ou seja, copia a pasta build), copia a pasta build para ./ ou seja, copia para a raiz desse projecto (Dessa nova imagem)
COPY --from=build /app/build ./
# Do stage 1 (chamado build) copia também a pasta /app/package*.json (Ou seja, copia o package.json e o package-lock.json) para ./, ou seja, para a raiz do projeto, isso é importante pq vamos usar eles para instalar dependências.
COPY --from=build /app/package*.json ./

# Aqui estamos efetivamente instalando as dependências usando o package.json e o package-lock.json que copiamos acima, estamos usando a flag --only=production para ter benefícios como não instalar dev dependencies
# O && npm cache clean --force ajuda a limpar cache e pode ajudar a imagem a ficar menor
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3333

# Rodando o server.js gerado no build. Como vemos, no stage 1 não rodamos a aplicação, a aplicação é rodada apenas aqui no último stage
CMD ["node", "server.js"]
