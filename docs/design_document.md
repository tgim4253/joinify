- 문제점 및 목표
    
    ### **문제**
    
    1. 홈커밍과 같이 캠퍼스에 계시지 않은 OB분들의 참여 여부를 전화로 일일이 확인해야 하는 비효율성
    2. 슬랙과 명단을 수동으로 매칭해야 하는 번거로움
    
    ### **목표**
    
    1. **이벤트 생성 기능**
        - 예: 2025 홈커밍 이벤트 생성 시, 관련 정보 입력 가능
    2. **명단 업로드 및 상태 관리**
        - 명단: 이름, 학번, 전화번호, 이메일 등
            - 특정 정보는 비공개(예시: 민감한 개인정보)/~자리까지 *표등(예시: 전화번호)
        - 상태: 참여/불참/미정, 연락됨/미연락 등 커스텀 가능
    3. **이벤트 대시보드**
        - 이벤트 정보 확인 가능
            - 위치, 기간, 대표자 연락 정보 등등
        - 테이블 형태로 정리된 명단 정보 + 상태 표시
    4. **슬랙 연동**
        - 슬랙 봇을 통해 개인이 참여 여부를 응답할 수 있음
        - 응답 내용을 DB에 자동 반영
        - 슬랙 계정과 명단을 자동 또는 반자동 매칭
            - /참여 이름 학번 이런식으로
            - 명단속의 이름/학번과 매칭이 되면 참여/불참 버튼 보여주고 응답 반영
            - 매칭되지 않을 경우 예외 처리
- 기술 스택
    
    
    | **백엔드** | 프레임워크: Node.js Express5 + TS
    DB: PostgreSQL + Prisma(ORM) |
    | --- | --- |
    | **프론트엔드** | React + TS |
    | **호스팅** | 하제 대군주 |
- 기능
    - 백엔드
        - DB 구조
            - DB 구조 그림 및 링크
                
                https://dbdiagram.io/d/Haje-Homecomming-DB-6862c667f413ba350892f58b
                
                ![image.png](attachment:7528fbcc-21b7-4304-98d6-6b63f9fddecd:image.png)
                
            - DBML 스키마
                
                ```jsx
                // ========= Core Tables =========
                Table users {                             // admin / operator accounts
                  id                bigserial   [pk]      // primary key
                  email             varchar(255) [unique]
                  password_hash     varchar(255)
                  role              varchar(20)           // 'admin' | 'viewer'
                  created_at        timestamptz           // DEFAULT now()
                }
                
                Table events {                            // yearly homecoming, etc.
                  id                bigserial [pk]
                  name              varchar(255)
                  description       text
                  location          varchar(255)
                  start_at          timestamptz
                  end_at            timestamptz
                  contact_name      varchar(100)
                  contact_phone     varchar(50)
                  banner_image_url  varchar(255)          // nullable
                  created_at        timestamptz           // DEFAULT now()
                }
                
                Table event_fields {                      // custom columns per event
                  id                bigserial [pk]
                  event_id          bigint                // FK → events
                  field_key         varchar(100)          // internal key
                  display_name      varchar(100)          // UI label
                  data_type         varchar(20)           // 'string' | 'number' | 'date' | 'boolean' | 'enum'
                  is_sensitive      boolean               // DEFAULT false
                  mask_from         smallint              // start pos (inclusive)
                  mask_to           smallint              // end pos (exclusive)
                  is_public         boolean               // DEFAULT true
                  enum_options      jsonb                 // nullable, e.g. ['참여','불참','미응답']
                  default_value     text                  // optional
                }
                
                Table members {                           // attendee roster
                  id                bigserial [pk]
                  event_id          bigint                // FK → events
                  data              jsonb                 // 모든 필드가 들어가는 JSON 객체
                  slack_user_id     varchar(50)           // nullable
                  updated_at        timestamptz           // DEFAULT now()
                }
                
                Table logs {                              // optional audit trail
                  id                bigserial [pk]
                  user_id           bigint                // FK → users
                  action            varchar(100)          // 'CREATE_EVENT' 등
                  payload           jsonb
                  created_at        timestamptz           // DEFAULT now()
                }
                
                // ========= Relationships & Cascade Rules =========
                Ref: event_fields.event_id > events.id [delete: cascade]
                Ref: members.event_id      > events.id [delete: cascade]
                Ref: logs.user_id          > users.id  [delete: restrict]
                ```
                
            - 테이블·컬럼 설명
                
                ### events
                
                | 컬럼 | 설명 |
                | --- | --- |
                | name, description, location | 이벤트 기본 정보 |
                | start_at, end_at | 일정 |
                | contact_name, contact_phone | 담당자 정보 |
                | banner_image_url | 배너 이미지 절대경로(URL) |
                
                ### event_fields
                
                | 컬럼 | 설명 |
                | --- | --- |
                | field_key | 내부 식별자(영문·snake_case) |
                | display_name | 화면 라벨(다국어 가능) |
                | data_type | string·number·date·boolean·enum |
                | is_*sensitive* | 개인정보 마스킹 규칙 |
                | mask_from, mask_to | mask 설 |
                | is_public | 일반 사용자에게 노출 여부 |
                | enum_options | enum 타입의 허용 값 목록(JSON 배열) |
                | default_value | 기본 값 |
                
                ### members
                
                | 컬럼 | 설명 |
                | --- | --- |
                | data | 예) `{"name":"홍길동","student_id":"20191234","status":"참여","contacted":true}` |
                | slack_user_id | 매칭된 Slack ID (`U01ABC...`) |
                | updated_at | 마지막 수정 시각 |
                
                ### logs
                
                행위 감사를 위한 선택 테이블. `user_id` 삭제를 제한(RESTRICT)해 로그 보존.
                
            - 제약 조건 · 인덱스
                
                ```sql
                -- event 내 field_key 중복 방지
                ALTER TABLE event_fields
                  ADD CONSTRAINT uniq_event_field_key UNIQUE (event_id, field_key);
                
                -- 대시보드 조회 가속
                CREATE INDEX idx_members_event ON members(event_id);
                
                -- JSONB 자주 검색 키 인덱스 예시 (student_id)
                CREATE INDEX idx_members_student_id
                  ON members
                  USING gin ((data ->> 'student_id'));
                
                ```
                
            - 데이터 예시
                
                ### event_fields 예시 레코드
                
                ```json
                {
                  "id": 3,
                  "event_id": 42,
                  "field_key": "status",
                  "display_name": "참여 상태",
                  "data_type": "enum",
                  "is_public": true,
                  "enum_options": ["참여", "불참", "미응답"],
                  "default_value": "미응답"
                }
                {
                  "id": 4,
                  "event_id": 42,
                  "field_key": "contacted",
                  "display_name": "연락 완료",
                  "data_type": "boolean",
                  "is_public": false,
                  "default_value": "false"
                }
                
                ```
                
                ### members 예시 레코드
                
                ```json
                {
                  "id": 101,
                  "event_id": 42,
                  "data": {
                    "name": "홍길동",
                    "student_id": "20191234",
                    "phone": "01012345678",
                    "status": "참여",
                    "contacted": true
                  },
                  "slack_user_id": "U01ABCDE99",
                  "updated_at": "2025-07-01T10:30:00+09:00"
                }
                
                ```
                
        - Api 정리
            - 인증
                
                
                | 메서드 | 경로 | 설명 |
                | --- | --- | --- |
                | **POST** | `/auth/login` | 이메일·비밀번호로 로그인, JWT 발급 |
                | **GET** | `/auth/me` | 토큰 검증 후 내 정보 반환 |
            - 이벤트 (Admin)
                
                
                | 메서드 | 경로 | 기능 |
                | --- | --- | --- |
                | **GET** | `/admin/events` | 이벤트 목록 조회 |
                | **POST** | `/admin/events` | 이벤트 생성 |
                | **GET** | `/admin/events/{eventId}` | 이벤트 상세 조회 |
                | **PATCH** | `/admin/events/{eventId}` | 이벤트 정보 수정 |
                | **DELETE** | `/admin/events/{eventId}` | 이벤트 삭제 (연쇄 삭제) |
            - 필드 관리
                
                
                | 메서드 | 경로 | 기능 |
                | --- | --- | --- |
                | **GET** | `/admin/events/{eventId}/fields` | 필드 목록 조회 |
                | **POST** | `/admin/events/{eventId}/fields` | 새 필드 추가 |
                | **PATCH** | `/admin/events/{eventId}/fields/{fieldId}` | 필드 수정 |
                | **DELETE** | `/admin/events/{eventId}/fields/{fieldId}` | 필드 삭제 |
            - 명단 관리
                
                
                | 메서드 | 경로 | 기능 |
                | --- | --- | --- |
                | **POST** | `/admin/events/{eventId}/members/upload` | CSV 업로드·자동 매핑 |
                | **GET** | `/admin/events/{eventId}/members` | 명단 목록 조회 |
                | **PATCH** | `/admin/events/{eventId}/members/{memberId}` | 단건 정보/상태 수정 |
                | **PATCH** | `/admin/events/{eventId}/members/bulk` | 다건 일괄 수정 |
            - 통계
                
                
                | 메서드 | 경로 | 기능 |
                | --- | --- | --- |
                | **GET** | `/admin/events/{eventId}/stats` | 참여·미응답 비율 등 요약 |
                
            - 일반 사용자
                
                
                | 메서드 | 경로 | 기능 |
                | --- | --- | --- |
                | **GET** | `/public/events` | 활성 이벤트 카드 리스트 |
                | **GET** | `/public/events/{eventId}` | 이벤트 정보 + 공개 필드만 명단 노출 |
            - Slack 봇 Webhook
                
                
                | 메서드 | 경로 | 기능 |
                | --- | --- | --- |
                | **POST** | `/public/slack/webhook` | Slash Command·버튼 응답 수신 |
    - 프론트엔드
        
        *언어 토글(한국어/영어)* 필요 시 번역 파일 구조 미리 설계
        
        - 어드민
            
            /admin/*
            
            로그인 토큰 없으면 페이지1로 이동
            
            로그인 유지 방식은 LocalStorage 또는 HTTP-only 쿠키
            
            - 페이지1-로그인 화면
                - 로그인해야지 어드민 페이지 접속 가능
            - 페이지2-현재 존재하는 이벤트 리스트
                - 일반(페이지1)과 레이아웃 및 기능 동일
                - 활성화된 이벤트 / 비활성화된 이벤
                - 이벤트 추가 버튼이 존재 → 클릭시 페이지3로 이동함
            - 페이지3-이벤트 추가/수정 화면
                - 이벤트 정보 입력
                    - 이름, 설명, 위치, 대표자 및 연락처, 대표 사진 등
                - CSV 업로드 기능
                    - csv 파일 서버에 업로드 후 명단 및 헤더를 가져옴
                    - csv 읽어온 정보 요약
                        - 인원 수, 필드 이름 등
                        - Validation 표
                - 데이터 필드 정의
                    - 위에서 csv에 매칭된 필드 이름은 default값으로 가짐
                    - 커스텀 필드 정의 가능
                        - 이름
                        - 자료형
                        - 민감한 정보 true / false
                            - open / close
                            - n자리부터 m자리까지 *표
                        - 등등
                    - 각 정보의 순서 및 세부 내용 설정
                        - 드래그로 순서 변경 가능하게
                        - 자료형을 바꿀 시 예시가 바로 변하도
                    - 이벤트의 활성/비활성
                    - <반영> 버튼으로 수정
            - 페이지4-이벤트 현황 대시보드
                - 기본적인 레이아웃 및 기능은 일반(페이지2)와 동일
                - 각 인원 정보 및 상태 수정
                    - 각 정보 옆에 연필 표시 → 연필을 누르면 수정할 수 있도록
                    - 상태 데이터는 누르면 바뀌도록
                    - 수정된 데이터는 밑줄이나 강조로 바뀌었음을 표시
                    - 리스트 아이템 맨 오른쪽에 <반영> 버튼으로 개별 저장 가능
                    - 리스트 위쪽에 <모두 반영> 버튼으로 전체 저장 가능
                - 여러 인원 선택 가
                - 상단에 이벤트 수정 버튼이 존재 → 클릭시 페이지3로 이동함
        - 일반
            - 페이지1-현재 존재하는 이벤트 리스트
                - 현재 존재하는 이벤트의 리스트를 보여줌
                - 진행중/마감/예정 색상으로 직관적으로 표
                - *Skeleton 카드* 로딩 → 빈 화면 순간 최소화
                - “참가 신청 마감 D-Day” 표시(예: D-3)
                - 카드형 ↔ 테이블형 토글 옵션
                - 각 이벤트는 카드 박스 또는 테이블 형으로 주어짐
                    - 카드형
                        - 이벤트 이름
                        - 일시
                        - 짧은 설명
                        - 활성 여부(음영으로?)
                    - 테이블형
                        - 이벤트 이름
                        - 일시
                        - 활성 여부
                - 이벤트 카드 박스를 클릭하면 해당 이벤트의 현황 대시보드로 넘어감
            - 페이지2-이벤트 현황 대시보드
                - 이벤트의 명단에 존재하는 인원들의 정보 및 상태가 나열되어있음
                    - 이름, 학번, 전화번호 등
                    - 민감한 정보는 설정에 따라 가려지거나 안 보여짐
                        - n번째부터 m번째까지 *로 표시 등
                            - 홍*동
                            - 010-****-**34
                    - 현재 상태 표시
                        - 참여/불참/미응답, 제출/미제출 등
                - 검색, 필터링 기능
                    - 이름, 학번, 참여/미참여 등등
                - 가상 스크롤(virtualization)
                    - 명단이 수백 명 이상일 때 렌더링 성능 확보
    - 슬랙봇
        - 슬랙봇으로 이벤트 정보 수정 가능
            - /(이벤트 이름) (이름) (학번) 으로 매칭
            - 매칭 되었을 경우 이벤트에서 설정한 대로 과정 진행
                - 참여/불참 버튼 표시 등
            - 매칭이 되지 않았을 경우 예외 처리
                - 현재 슬랙봇과 매칭되지 않은 사용자 리스트를 보여주기 등
        - 슬랙봇으로 이벤트 상태 확인
            - /(이벤트 이름) info
        - 슬랙봇으로 이벤트에서 자신의 상태 확인
            - /(이벤트 이름) status
        
- todo.
    - 전체 개발 체크포인트
        
        ### 1. 프로젝트 초기 세팅
        
        - [x]  **기술 스택 최종 확정**
            - FastAPI vs Node (Express/Nest) 비교 → 선택
                - Node의 Express + TypeScript
            - React + Vite + TypeScript 결정
        - [ ]  **레포·브랜치 전략 정의**
            - `main` / `develop` / feature 브랜치
            - Conventional Commit 규칙
        - [ ]  **도커라이징 및 베이스 이미지**
            - 멀티-스테이지 Dockerfile 작성
            - 로컬 `docker‐compose.yml` → DB·백엔드·프론트 실행
        - [ ]  **CI/CD 파이프라인**
            - GitHub Actions : Lint → Test → Build → Docker Push
            - 스테이징/프로덕션 배포(예: [Fly.io](http://fly.io/), Render, AWS ECS)
        
        ---
        
        ### 2. 백엔드 구현
        
        - [ ]  **DB 마이그레이션 툴 도입** (`alembic`, `prisma`, `knex` 중 택)
        - [ ]  **핵심 API**
            - [ ]  Auth (JWT·refresh)
            - [ ]  Events CRUD
            - [ ]  Event Fields CRUD
            - [ ]  Members CSV 업로드·조회·수정(Bulk)
            - [ ]  Stats 엔드포인트
        - [ ]  **Slack Webhook 엔드포인트**
            - Slash Command 파싱 → 작업큐(RQ/Sidekiq) 연동
        - [ ]  **OpenAPI(Swagger) 문서 자동 생성**
        
        ---
        
        ### 3. 프론트엔드 (Admin 판)
        
        - [ ]  **라우팅 구조 설계** (`/admin/login`, `/admin/events`, …)
        - [ ]  **상태 관리 선택** (`Zustand`, `TanStack Query`)
        - [ ]  **인증 가드** (JWT + LocalStorage / HTTP-only Cookie)
        - [ ]  **이벤트 목록 페이지**
            - 페이지네이션·검색·정렬
        - [ ]  **이벤트 생성/수정 마법사**
            1. 기본 정보
            2. CSV 업로드 및 헤더 매핑
            3. 커스텀 필드 정의
            4. 최종 검토 & 저장
        - [ ]  **대시보드 테이블(가상 스크롤)**
            - 인라인 편집·셀 하이라이트
            - “모두 반영”/“개별 반영” 버튼
        
        ---
        
        ### 4. 프론트엔드 (사용자 판)
        
        - [ ]  **이벤트 카드/테이블 토글 뷰**
        - [ ]  **D-Day 표시 및 스켈레톤 로딩**
        - [ ]  **이벤트 상세 & 명단 뷰어**
            - 개인정보 마스킹 규칙 적용
            - 필터·검색·정렬
        - [ ]  **다국어(i18n) 파일 분리** (ko/en)
        
        ---
        
        ### 5. Slack Bot
        
        - [ ]  **앱·토큰 설정** & OAuth 배포
        - [ ]  **Slash Command**
            - `/참여 {이벤트} {이름} {학번}`
            - `/참여 {이벤트} info | status`
        - [ ]  **인터랙티브 버튼** (참여/불참) 응답 → DB 업데이트
        - [ ]  **미매칭 사용자 예외 시나리오**
        
        ---
        
        ### 6. 품질 및 보안
        
        - [ ]  **단위 테스트** (pytest / Jest + React Testing Library)
        - [ ]  **통합 테스트** (Playwright E2E)
        - [ ]  **Lint & Format** (ruff / eslint-airbnb / prettier)
        - [ ]  **보안 대책**
            - 비밀번호 해싱 (bcrypt/argon2)
            - 입력 Validation (Pydantic/Zod)
            - Rate Limiter, CORS, Helmet
        - [ ]  **모니터링/로깅**
            - Sentry, Prometheus(+Grafana)
            - 구조화 로그(JSON)
        
        ---
        
        ### 7. 배포 & 운영
        
        - [ ]  **스테이징 환경** URL 공유
        - [ ]  **DB 백업 전략** (S3·R2 주기 스냅샷)
        - [ ]  **릴리스 노트 자동 생성** (GitHub Releases)
        - [ ]  **서비스 레벨 지표 정의** (가용성, 응답시간)
        
        ---
        
        ### 8. 문서화
        
        - [ ]  **README 업데이트** (개발 가이드·로컬 세팅)
        - [ ]  **시스템 아키텍처 다이어그램**
        - [ ]  **기능별 ERD 링크 정리**
        - [ ]  **운영 Runbook** (장애 대응 절차)
        
        ---
        
        ### 9. 향후 고려 과제 (Backlog)
        
        - [ ]  **멀티 이벤트 타임라인** 뷰(캘린더)
        - [ ]  **모바일 PWA**
        - [ ]  **SAML/SSO 기관 로그인 연동**
        - [ ]  **알림 채널 확장** (이메일·카카오 알림톡)
    - 우선순위
        - **레포·브랜치 전략 & 커밋 규칙 정의**
        - **도커 베이스 구축**
            - 멀티-스테이지 Dockerfile, `docker-compose.yml`(DB·BE·FE)
        - **CI/CD 파이프라인 스캐폴딩** (GitHub Actions → Lint/Test/Build)
        - **DB 마이그레이션 툴 도입 & 초기 스키마 적용**
        - **핵심 인증 모듈**
            - JWT 발급·검증, User 모델/엔드포인트
        - **이벤트·필드·멤버 Core API**
            
            7.1. Events CRUD
            
            7.2. Event Fields CRUD
            
            7.3. Members CSV 업로드·조회·수정
            
        - **OpenAPI(Swagger) 자동 문서화 설정**
        - **Admin 프론트엔드 뼈대 생성** (`/admin/login`, `/admin/events`)
            
            9.1. 라우터·Auth Guard
            
            9.2. 상태 관리(Zustand/TanStack Query)
            
        - **이벤트 생성/수정 마법사 (CSV 매핑 포함)**
        - **Admin 대시보드 테이블 + 가상 스크롤**
        - **기본 통계 엔드포인트 & 차트 렌더링**
        - **Slack Webhook 엔드포인트** (Slash Command 파싱)
        - **Slack Bot 인터랙티브 버튼 → DB 업데이트**
        - **사용자용 프론트**
            - 이벤트 카드/테이블 뷰 + D-Day 표시
            - 상세 페이지(개인정보 마스킹·필터)
        - **다국어(i18n) 구조 적용** (ko/en)
        - **단위·통합 테스트 작성** (pytest/Jest, Playwright)
        - **Lint & Format 파이프라인 고정** (ruff/eslint/prettier)
        - **기본 보안 대책 적용**
            - 비밀번호 해싱, 입력 Validation, Rate Limiter
        - **스테이징 환경 배포 & 테스트 데이터 시드**
        - **모니터링/로깅** (Sentry, Prometheus)
        - **DB 백업·복구 전략 수립**
        - **릴리스 노트 자동화 & 버전 태깅**
        - **문서화 마무리**
            - README, 아키텍처 다이어그램, Runbook
        - **백로그 기능** (모바일 PWA, SSO, 알림톡 등) 우선순위 재평가 후 착수
    
    ### 
    

## 지피티의 추천 팁

**상태 관리 전략**

- **데이터 테이블**은 서버 페이지네이션 + React Query(SWR) 캐싱 추천
- *폼(이벤트 생성/편집)은 둔감한 데이터만 클라이언트 상태에 유지* → 민감 데이터는 제출 시점에만 전송

카드 뷰(Grid) + 테이블(Scroll-Snap) 패턴으로 모바일 대응

| **실시간 업데이트** | WebSocket/Server-Sent Events로 동시 편집 충돌 방지 |
| --- | --- |

| *필터/서치 바 고정* | 스크롤 길어도 검색바가 사라지지 않도록 Sticky Header |
| --- | --- |
