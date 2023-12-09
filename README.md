# FE
cd tarot-front
# 도커 빌드
docker build -t tarot-front .

docker run -p 4173:4173 tarot-front
