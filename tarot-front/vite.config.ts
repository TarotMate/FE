import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.tarotmate.kr',
        changeOrigin: true, // 서버에 대한 요청에서 origin 헤더를 변경
        secure: false, // https 사용 시 SSL 검증을 건너뜁니다 (개발용)
        rewrite: (path) => path.replace(/^\/api/, '') // 경로 재작성
      }
    }
  }
});
