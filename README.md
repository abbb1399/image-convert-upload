# Image Convert & Upload

이미지를 WebP로 변환하거나, S3 호환 스토리지에 업로드할 수 있는 웹 도구입니다.

**[image-convert-upload.vercel.app](https://image-convert-upload.vercel.app)**

---

## 기능

### WebP 변환

- 이미지 파일을 드래그 앤 드롭 또는 클릭으로 선택
- ffmpeg을 사용해 서버에서 WebP로 변환 (quality 85)
- 변환 결과 미리보기 및 다운로드
- 최대 4.5MB

### S3 업로드

- 이미지 파일을 최대 5개 동시 업로드
- Presigned URL 방식으로 클라이언트에서 직접 S3에 업로드
- 업로드 진행률 실시간 표시
- 업로드된 파일 삭제 지원
- 파일당 최대 5MB

---

## 기술 스택

| 분류        | 기술                                  |
| ----------- | ------------------------------------- |
| Framework   | Next.js 15 (App Router)               |
| UI          | Tailwind CSS, shadcn/ui               |
| 이미지 변환 | ffmpeg (fluent-ffmpeg, ffmpeg-static) |
| 파일 업로드 | react-dropzone                        |
| 스토리지    | T3 Storage (S3 호환, AWS SDK v3)      |
| 배포        | Vercel                                |

---

## API

| 메서드   | 경로             | 설명               |
| -------- | ---------------- | ------------------ |
| `POST`   | `/api/convert`   | 이미지 → WebP 변환 |
| `POST`   | `/api/s3/upload` | Presigned URL 발급 |
| `DELETE` | `/api/s3/delete` | S3 파일 삭제       |

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 S3 관련 값 입력

# 개발 서버 시작
npm run dev
```

### 환경 변수

```env
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
