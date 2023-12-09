# Node.js LTS 버전을 기반 이미지로 사용
FROM node:18.16.0

# 앱 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json을 컨테이너에 복사
COPY package*.json ./tarotfront

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 앱 실행을 위한 포트 지정
EXPOSE 4173

# 애플리케이션 실행
CMD ["npm", "run", "preview"]
