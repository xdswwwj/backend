const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const schemaFile = path.join(__dirname, 'schema.prisma');

// 공통 설정
const header = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

function mergeSchemas() {
  // `models` 디렉토리에서 `.prisma` 파일 읽기
  const modelFiles = fs
    .readdirSync(modelsDir)
    .filter((file) => file.endsWith('.prisma'));

  // 파일 내용 병합
  const models = modelFiles.map((file) =>
    fs.readFileSync(path.join(modelsDir, file), 'utf-8'),
  );

  // 최종 schema.prisma 파일 생성
  fs.writeFileSync(schemaFile, header + models.join('\n\n'));
  console.log('Schema merged successfully!');
}

// 실행
mergeSchemas();
