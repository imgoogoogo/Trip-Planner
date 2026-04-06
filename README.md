# Trip-Planner (컴퓨터공학종합설계1 개인 프로젝트)

### 목차

- **요구분석**
  - [프로젝트 소개](#프로젝트-소개)
  - [프로젝트 목적](#프로젝트-목적)
  - [문제 정의](#문제-정의)
  - [예상 사용자](#예상-사용자)
  - [기능 요구사항](#기능-요구사항)
  - [비기능 요구사항](#비기능-요구사항)
  - [유스케이스](#유스케이스)
- **설계**
  - [시스템 아키텍처](#시스템-아키텍처)
  - [데이터베이스 설계 (ERD)](#데이터베이스-설계(ERD))
  - [데이터베이스 명세서](#데이터베이스-명세서)
  - [API 설계](#api-설계)
- **구현**
  - [프론트엔드](#프론트엔드)
  - [백엔드](#백엔드)
  - [데이터베이스](#데이터베이스)
- **테스트**
  - [테스트 전략](#테스트-전략)
  - [테스트 케이스](#테스트-케이스)
  - [테스트 결과](#테스트-결과)
 
- [설치 및 실행](#설치-및-실행)
- [향후 개선 사항](#향후-개선-사항)

<br>

---

## 프로젝트 소개

**Trip Planner**는 OpenStreetMap 기반의 지도에서 장소를 검색하고, Day별 여행 일정을 구성한 뒤 다른 사용자와 공유할 수 있는 여행 계획 플랫폼입니다.

사용자는 지도 위에서 카페, 식당, 숙소 등 관심 장소를 탐색하고 일정에 추가하면서 직관적으로 여행을 계획할 수 있습니다. 완성된 일정은 공개 설정을 통해 다른 여행자들과 공유하고 좋아요로 반응을 주고받을 수 있습니다.

<br>

---

## 프로젝트 목적

- 지도와 일정 관리를 하나의 화면에서 통합하여 여행 계획의 번거로움을 줄인다.
- 다른 여행자들의 일정을 참고함으로써 여행 정보 탐색 시간을 단축한다.
- 나만의 여행 기록을 체계적으로 저장하고 관리할 수 있는 개인 여행 아카이브를 제공한다.

<br>

---

## 문제 정의

| 문제 | 내용 |
|------|------|
| **분산된 도구** | 지도 검색, 일정 작성, 메모를 각각 다른 앱에서 해야 하는 불편함 |
| **정보 재활용 어려움** | 블로그나 SNS에 흩어진 여행 후기를 일정으로 바로 활용하기 어려움 |
| **일정 관리 복잡성** | 스프레드시트나 메모앱으로 Day별 일정을 관리하는 비효율 |
| **공유 불편** | 완성된 일정을 다른 사람과 공유하려면 별도의 캡처·링크 전달이 필요 |

<br>

---

### 예상 사용자

| 유형 | 설명 |
|------|------|
| **여행 계획자** | 해외·국내 여행을 구체적으로 계획하고 싶은 일반 사용자 |
| **여행 공유자** | 자신의 여행 경험과 일정을 다른 사람들과 나누고 싶은 사용자 |
| **여행 참고자** | 여행지를 결정하지 못했거나 현지 일정 참고가 필요한 사용자 |

<br>

---

## 기능 요구사항

### 인증
- Google OAuth 2.0을 통한 소셜 로그인
- JWT 토큰 기반 세션 유지 (유효기간 7일)
- 로그인 없이 인기 여행 조회 가능 (읽기 전용)

### 여행 관리
- 여행 제목, 국가, 설명, 시작일/종료일 설정
- 여행 생성, 수정, 삭제
- 여행 공개/비공개 설정 (토글)

### 일정 관리
- Day별 타임라인 구성 (시작일~종료일 자동 계산)
- 지도에서 장소 검색 후 특정 Day에 추가
- 일정 내 장소 삭제
- 전체 일정 저장 (여행 및 스케줄 일괄 저장)

### 지도 기능
- OpenStreetMap + Nominatim API 기반 장소 검색
- 카테고리 필터링 (카페, 식당, 숙소, 약국)
- 검색 반경 시각화 (원형 반경 표시)
- 추가된 장소 번호 마커 표시
- 장소 클릭 시 상세 정보 패널 표시

### 커뮤니티
- 공개된 여행 일정 목록 조회 (인기순, 장소순, 기간순 정렬)
- 여행 좋아요 토글
- 다른 사용자 일정 조회 (읽기 전용)

<br>

---

## 비기능 요구사항

| 항목	| 설명 |
|----|-----|
|사용성 |	지도 기반 UI를 통해 여행 장소를 직관적으로 등록할 수 있어야 한다|
|성능 | 일반적인 요청에 대해 시스템 응답시간은 2초 이내로 유지한다|
|보안 |	사용자 인증은 JWT 기반 인증을 사용한다|
|확장성	| 여러 사용자가 동시에 여행 계획을 관리할 수 있도록 설계한다|
|호환성	| 웹 브라우저 환경에서 정상적으로 동작해야 한다|

<br>

---

## 유스케이스
<img width="800" alt="image" src="https://github.com/user-attachments/assets/690c62e0-61ec-412d-bac3-fac722fb8ca1" />


<br>

---

## 시스템 아키텍처

<img width="3044" height="1568" alt="image" src="https://github.com/user-attachments/assets/c2176118-bc50-4e10-8c42-4ab0c8181f69" />

<br>

---

## 데이터베이스 설계(ERD)

<img src="https://github.com/user-attachments/assets/7556c1cb-48ac-4a5f-9cdf-9a03ca61b152" width="480" align="left" style="margin-right: 20px;">

### ERD 관계 설명
#### ① 한 사용자는 여러 여행에 참여할 수 있다.
#### ② 한 사용자는 여러 여행을 생성할 수 있다.
#### ③ 일정은 누가 작성했는지 기록한다. 
#### ④ 하나의 여행에는 여러 일정이 존재한다. 
#### ⑤ 하나의 장소는 여러 일정에서 사용될 수 있다. 
#### ⑥ 하나의 여행에는 여러 사용자가 참여할 수 있다.
#### ⑦ 하나의 여행에는 여러 장소가 등록될 수 있다.

<br clear="both">
<br>

---

## 데이터베이스 명세서

### users 테이블

사용자 계정 정보를 저장하는 테이블이다.

| 컬럼 | 타입 | NULL | KEY | 기본값 | 설명 |
|------|------|------|-----|--------|------|
| user_id | INT(11) | NOT NULL | PK | AUTO_INCREMENT | 사용자 고유 ID |
| email | VARCHAR(100) | NOT NULL | UNIQUE | - | 이메일 주소 |
| password | VARCHAR(255) | NOT NULL | - | - | 비밀번호 (Google 로그인 시 `GOOGLE_OAUTH`) |
| name | VARCHAR(50) | NOT NULL | - | - | 사용자 이름 |
| created_at | TIMESTAMP | NULL | - | CURRENT_TIMESTAMP | 생성 일시 |

### trips 테이블

| 컬럼 | 타입 | NULL | KEY | 기본값 | 설명 |
|------|------|------|-----|--------|------|
| trip_id | INT(11) | NOT NULL | PK | AUTO_INCREMENT | 여행 고유 ID |
| creator_id | INT(11) | NOT NULL | FK | - | 작성자 ID (→ users) |
| title | VARCHAR(100) | NOT NULL | - | - | 여행 제목 |
| country | VARCHAR(100) | NULL | - | NULL | 여행 국가/도시 |
| description | TEXT | NULL | - | NULL | 여행 설명 |
| start_date | DATE | NULL | - | NULL | 여행 시작일 |
| end_date | DATE | NULL | - | NULL | 여행 종료일 |
| image_url | TEXT | NULL | - | NULL | 대표 이미지 URL |
| likes | INT(11) | NULL | - | 0 | 좋아요 수 |
| saves | INT(11) | NULL | - | 0 | 저장 수 |
| is_public | TINYINT(1) | NULL | - | 0 | 공개 여부 (0: 비공개, 1: 공개) |
| created_at | TIMESTAMP | NULL | - | CURRENT_TIMESTAMP | 생성 일시 |

### trip_members 테이블

| 컬럼 | 타입 | NULL | KEY | 기본값 | 설명 |
|------|------|------|-----|--------|------|
| member_id | INT(11) | NOT NULL | PK | AUTO_INCREMENT | 멤버 고유 ID |
| trip_id | INT(11) | NOT NULL | FK | - | 여행 ID (→ trips, CASCADE) |
| user_id | INT(11) | NOT NULL | FK | - | 사용자 ID (→ users, CASCADE) |
| role | ENUM | NULL | - | `member` | 역할 (`owner` / `member`) |

### trip_likes

| 컬럼 | 타입 | NULL | KEY | 기본값 | 설명 |
|------|------|------|-----|--------|------|
| trip_id | INT(11) | NOT NULL | PK, FK | - | 여행 ID (→ trips) |
| user_id | INT(11) | NOT NULL | PK, FK | - | 사용자 ID (→ users) |

### schedules

| 컬럼 | 타입 | NULL | KEY | 기본값 | 설명 |
|------|------|------|-----|--------|------|
| schedule_id | INT(11) | NOT NULL | PK | AUTO_INCREMENT | 스케줄 고유 ID |
| trip_id | INT(11) | NOT NULL | FK | - | 여행 ID (→ trips, CASCADE) |
| place_id | INT(11) | NULL | FK | NULL | 장소 ID (→ places, SET NULL) |
| creator_id | INT(11) | NOT NULL | FK | - | 작성자 ID (→ users) |
| title | VARCHAR(100) | NOT NULL | - | - | 스케줄 제목 |
| description | TEXT | NULL | - | NULL | 스케줄 설명 |
| start_time | DATETIME | NULL | - | NULL | 시작 일시 (날짜로 Day 계산) |
| end_time | DATETIME | NULL | - | NULL | 종료 일시 |
| visibility | ENUM | NULL | - | `trip` | 공개 범위 (`public` / `trip` / `private`) |
| created_at | TIMESTAMP | NULL | - | CURRENT_TIMESTAMP | 생성 일시 |

---

### places

| 컬럼 | 타입 | NULL | KEY | 기본값 | 설명 |
|------|------|------|-----|--------|------|
| place_id | INT(11) | NOT NULL | PK | AUTO_INCREMENT | 장소 고유 ID |
| trip_id | INT(11) | NOT NULL | FK | - | 여행 ID (→ trips, CASCADE) |
| name | VARCHAR(100) | NOT NULL | - | - | 장소 이름 |
| latitude | DECIMAL(10,7) | NOT NULL | - | - | 위도 |
| longitude | DECIMAL(10,7) | NOT NULL | - | - | 경도 |
| description | TEXT | NULL | - | NULL | 장소 설명 |

<br>

---

## 📡 API 명세서


```
Authorization: Bearer <JWT_TOKEN>
```

---

### 🔐 Auth API

#### Google OAuth 로그인
```
GET /api/auth/google
```
Google OAuth 인증 페이지로 리다이렉트합니다.

---

#### Google OAuth 콜백
```
GET /api/auth/google/callback
```
Google 인증 완료 후 JWT 토큰과 함께 클라이언트로 리다이렉트합니다.
```
Redirect → {CLIENT_URL}/auth/callback?token=<JWT_TOKEN>
```

---

#### 현재 사용자 정보 조회
```
GET /api/auth/me
Authorization: Bearer <token>
```
**Response 200**
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "profile_image": "https://..."
}
```

---

### ✈️ Trips API

#### 여행 생성
```
POST /api/trips
Content-Type: application/json
```
**Request Body**
```json
{
  "creator_id": 1,
  "title": "도쿄 여행",
  "country": "일본",
  "description": "벚꽃 시즌 도쿄 여행",
  "start_date": "2025-04-01",
  "end_date": "2025-04-05"
}
```
**Response 200**
```json
{
  "message": "Trip created",
  "trip_id": 42
}
```

---

#### 인기 여행 조회
```
GET /api/trips/popular
Authorization: Bearer <token>  (선택)
```
좋아요 수 기준 상위 20개를 반환합니다. 로그인 시 `user_liked` 필드 포함.

**Response 200**
```json
[
  {
    "trip_id": 1,
    "title": "도쿄 여행",
    "country": "일본",
    "description": "...",
    "start_date": "2025-04-01",
    "end_date": "2025-04-05",
    "likes": 24,
    "duration_days": 5,
    "places_count": 8,
    "author_name": "홍길동",
    "user_liked": true
  }
]
```

---

#### 내 여행 목록 조회
```
GET /api/trips/my
Authorization: Bearer <token>
```
**Response 200**
```json
[
  {
    "trip_id": 1,
    "title": "도쿄 여행",
    "country": "일본",
    "start_date": "2025-04-01",
    "end_date": "2025-04-05",
    "is_public": 1,
    "duration_days": 5,
    "places_count": 8,
    "likes": 24
  }
]
```

---

#### 특정 여행 조회
```
GET /api/trips/:id
```
**Response 200**
```json
{
  "trip_id": 1,
  "creator_id": 1,
  "title": "도쿄 여행",
  "country": "일본",
  "description": "...",
  "start_date": "2025-04-01",
  "end_date": "2025-04-05",
  "is_public": 1,
  "likes": 24
}
```

---

#### 여행 수정
```
PUT /api/trips/:id
Content-Type: application/json
```
**Request Body**
```json
{
  "title": "도쿄 벚꽃 여행",
  "country": "일본",
  "description": "수정된 설명",
  "start_date": "2025-04-01",
  "end_date": "2025-04-06"
}
```
**Response 200**
```json
{ "message": "Trip updated" }
```

---

#### 여행 삭제
```
DELETE /api/trips/:id
```
**Response 200**
```json
{ "message": "Trip deleted" }
```

---

#### 좋아요 토글
```
PATCH /api/trips/:id/like
Authorization: Bearer <token>
```
**Response 200**
```json
{ "liked": true }
```

---

#### 공개 여부 설정
```
PATCH /api/trips/:id/visibility
Authorization: Bearer <token>
Content-Type: application/json
```
**Request Body**
```json
{ "is_public": true }
```
**Response 200**
```json
{ "is_public": 1 }
```

---

### 📅 Schedules API

#### 스케줄 생성
```
POST /api/schedules
Content-Type: application/json
```
**Request Body**
```json
{
  "trip_id": 1,
  "creator_id": 1,
  "title": "아사쿠사 방문",
  "description": "도쿄 전통 사원",
  "start_time": "2025-04-01 09:00:00",
  "end_time": null,
  "visibility": "trip"
}
```
**Response 200**
```json
{
  "message": "Schedule created",
  "schedule_id": 10
}
```

---

#### 여행별 스케줄 조회
```
GET /api/schedules/trip/:trip_id
```
start_time 오름차순 정렬하여 반환합니다.

**Response 200**
```json
[
  {
    "schedule_id": 10,
    "trip_id": 1,
    "title": "아사쿠사 방문",
    "description": "도쿄 전통 사원",
    "start_time": "2025-04-01T09:00:00.000Z",
    "end_time": null,
    "visibility": "trip"
  }
]
```

---

#### 스케줄 수정
```
PUT /api/schedules/:id
Content-Type: application/json
```
**Request Body**
```json
{
  "title": "아사쿠사 사원",
  "description": "수정된 설명",
  "start_time": "2025-04-01 10:00:00",
  "end_time": null,
  "visibility": "trip"
}
```
**Response 200**
```json
{ "message": "Schedule updated" }
```

---

#### 여행의 스케줄 전체 삭제
```
DELETE /api/schedules/trip/:trip_id
```
해당 여행의 모든 스케줄을 삭제합니다. (여행 수정 시 기존 일정 초기화에 사용)

**Response 200**
```json
{ "message": "Schedules deleted" }
```

---

#### 특정 스케줄 삭제
```
DELETE /api/schedules/:id
```
**Response 200**
```json
{ "message": "Schedule deleted" }
```

---

### 📍 Places API

#### 장소 생성
```
POST /api/places
Content-Type: application/json
```
**Request Body**
```json
{
  "trip_id": 1,
  "name": "아사쿠사 사원",
  "latitude": 35.7148,
  "longitude": 139.7967,
  "description": "도쿄 전통 사원"
}
```
**Response 200**
```json
{
  "message": "Place created",
  "place_id": 5
}
```

---

#### 여행별 장소 조회
```
GET /api/places/:trip_id
```
**Response 200**
```json
[
  {
    "place_id": 5,
    "trip_id": 1,
    "name": "아사쿠사 사원",
    "latitude": "35.7148000",
    "longitude": "139.7967000",
    "description": "도쿄 전통 사원"
  }
]
```

---

#### 장소 수정
```
PUT /api/places/:id
Content-Type: application/json
```
**Response 200**
```json
{ "message": "Place updated" }
```

---

#### 장소 삭제
```
DELETE /api/places/:id
```
**Response 200**
```json
{ "message": "Place deleted" }
```

<br>

---

## 프론트엔드

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 |
| 빌드 도구 | Vite |
| 라우팅 | React Router DOM 7 |
| 지도 | React-Leaflet 5 + Leaflet 1.9 |
| 스타일링 | Tailwind CSS 3 |
| 인증 | jwt-decode |
| 외부 API | Nominatim (OSM), REST Countries |

---

## 백엔드

| 분류 | 기술 |
|------|------|
| 런타임 | Node.js |
| 프레임워크 | Express 5 |
| 데이터베이스 | MariaDB (MySQL 호환) |
| ORM/드라이버 | mysql2 |
| 인증 | Passport.js (Google OAuth 2.0) + JWT |
| 환경변수 | dotenv |
| 세션 | express-session |

---

## 데이터베이스

| 기술 | 버전 | 설명 |
|------|------|------|
| MariaDB | 12.1.2 | MySQL 호환 관계형 데이터베이스. 여행·일정·사용자 데이터 영구 저장 |
| mysql2 | 3.20.0 | Node.js용 MySQL/MariaDB 드라이버. Callback 방식 쿼리 실행 |

### 저장 데이터 설명

| 테이블 | 저장 데이터 |
|--------|------------|
| `users` | 사용자 계정 정보 (이메일, 이름, Google OAuth 여부) |
| `trips` | 여행 메타데이터 (제목, 국가, 설명, 날짜, 공개 여부, 좋아요 수) |
| `schedules` | 여행 내 일정 항목 (Day별 장소 이름, 방문 시간, 공개 범위) |
| `places` | 지도에서 선택한 장소의 좌표 및 이름 (trip에 종속) |
| `trip_likes` | 사용자별 여행 좋아요 기록 (중복 방지용 복합 PK) |
| `trip_members` | 여행 멤버 및 역할 (owner / member, 향후 협업 기능용) |

<br>

---

## 4.1 테스트 전략

시스템의 주요 기능에 대해 기능 테스트를 수행하여 정상 동작 여부를 확인한다.

---

## 4.2 테스트 케이스

| 테스트 ID | 기능    | 테스트 내용      | 기대 결과  |
| ------ | ----- | ----------- | ------ |
| TC-01  | 회원가입  | 이메일 입력 후 가입 | 회원 생성  |
| TC-02  | 로그인   | 올바른 계정 입력   | 로그인 성공 |
| TC-03  | 그룹 생성 | 그룹 이름 입력    | 그룹 생성  |
| TC-04  | 일정 등록 | 일정 정보 입력    | 일정 저장  |
| TC-05  | 일정 수정 | 일정 수정       | 수정 성공  |
| TC-06  | 일정 삭제 | 일정 삭제       | 삭제 성공  |

---

## 4.3 테스트 결과

* 회원가입 정상 동작
* 로그인 정상 동작
* 그룹 생성 정상 동작
* 일정 등록 및 수정 정상 동작
* 일정 삭제 정상 동작

---

## 설치 및 실행

### 사전 요구사항

- Node.js 18+
- MariaDB / MySQL
- Google Cloud Console OAuth 2.0 클라이언트 ID

### 1. 저장소 클론

```bash
git clone https://github.com/<your-username>/Trip-Planner.git
cd Trip-Planner
```

### 2. 데이터베이스 설정

```sql
CREATE DATABASE trip_planner CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE trip_planner;
```

`backend/trip.sql` 파일을 실행하여 테이블을 생성합니다.

```bash
mysql -u root -p trip_planner < backend/trip.sql
```

`trips` 테이블에 `country`와 `is_public` 컬럼이 없다면 추가합니다.

```sql
ALTER TABLE trips ADD COLUMN country VARCHAR(100) DEFAULT NULL AFTER title;
ALTER TABLE trips ADD COLUMN is_public TINYINT(1) DEFAULT 0;
```

### 3. 백엔드 설정

```bash
cd backend
npm install
```

`backend/.env` 파일 생성:

```env
SERVER_HOST=127.0.0.1
SERVER_PORT=3000

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trip_planner

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

CLIENT_URL=http://localhost:5173
```

```bash
npm start
```

### 4. 프론트엔드 설정

```bash
cd frontend
npm install
```

`frontend/.env` 파일 생성:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

### 5. 접속

브라우저에서 `http://localhost:5173` 접속

<br>

---

# 향후 개선 사항

| 항목 | 설명 |
|------|------|
| **협업 일정 관리** | `trip_members` 테이블 활용, 여러 사용자가 하나의 여행 일정을 함께 편집 |
| **일정 시간 설정** | 스케줄 항목에 시작/종료 시간 직접 입력 및 시간대별 타임라인 뷰 제공 |
| **여행 이미지 업로드** | 직접 이미지 파일 업로드 기능 (현재는 image_url 필드만 존재) |
| **댓글 및 리뷰** | 공개된 여행 일정에 댓글 작성 및 별점 평가 기능 |
| **여행 검색** | 제목, 국가, 기간 등 조건으로 여행 검색 기능 |
| **지도 경로 표시** | 추가된 장소들을 연결하는 이동 경로 시각화 |
| **즐겨찾기/저장** | 다른 사용자의 여행을 저장하여 나중에 참고 (saves 컬럼 활용) |

