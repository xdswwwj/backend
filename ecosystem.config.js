module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/main.js', // 실행할 파일 (NestJS 빌드된 엔트리)
      instances: 4, // 클러스터 모드로 CPU 코어 수만큼 실행
      exec_mode: 'cluster', // fork(단일 프로세스) 또는 cluster(멀티 프로세스)
      autorestart: true, // 자동 재시작
      watch: false, // 소스 코드 변경 감지하여 자동 재시작 여부
      max_memory_restart: '1G', // 1GB 이상 메모리 사용 시 재시작
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    // {
    //   name: 'service-worker',
    //   script: './service-worker/index.js', // 실행할 파일 정확히 지정
    //   watch: ['./service-worker'], // service-worker 폴더 내 변경 사항 감지
    // },
  ],

  deploy: {
    production: {
      user: process.env.SSH_ROOT, // 실제 SSH 사용자
      host: process.env.SSH_HOST, // 실제 서버 IP 또는 도메인
      ref: 'origin/main', // Git 브랜치 (master 또는 main)
      repo: process.env.SSH_REPO, // 실제 Git 리포지토리 주소
      path: process.env.SSH_PATH, // 서버에서 배포할 디렉터리
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
