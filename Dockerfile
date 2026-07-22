# 第一阶段  编译  需要node环境
 FROM node:22-alpine3.23 AS builder

 WORKDIR /webapp

 COPY package.json package-lock.json ./

# ARG NPM_TOKEN
# RUN npm config set //your-nexus-domain/repository/npm-group/:_authToken ${NPM_TOKEN}
# RUN npm ci --no-audit --no-fund --no-optional --verbose

# RUN npm install 
RUN npm config set registry https://registry.npmmirror.com && npm install --legacy-peer-deps --no-audit --no-fund
    
COPY . .
RUN npm run build


# 第二阶段  运行  需要nginx环境
FROM nginx:alpine
COPY --from=builder /webapp/dist /usr/share/nginx/html
#COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80
