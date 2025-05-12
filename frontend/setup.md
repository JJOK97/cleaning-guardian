# 청소의 신 MVP 버전 세팅 문서

## 🎯 목표

React + PWA 기반의 슬라이스형 하이퍼캐주얼 게임  
MVP로는 **플라스틱 오션(Plastic Ocean)** 맵 1개만 구현  
전체 구조 검증 및 슬라이스 기반 인게임 완성까지 목표

---

## 1. 프로젝트 생성

```bash
npx create-react-app cleaning-guardian --template cra-template-pwa
```

또는 Vite:

```bash
npm create vite@latest cleaning-guardian -- --template react
```

---

## 2. 필수 라이브러리 설치

```bash
npm install \
  @use-gesture/react \
  framer-motion \
  react-konva \
  konva \
  howler \
  zustand \
  react-router-dom
```

---

## 3. 게임 흐름 (MVP 기준)

```
▶ SplashScreen (로딩)
   └→ MainMapScreen (맵: Plastic Ocean)
       └→ StageSelectScreen (스테이지 1개만)
           └→ StageDescriptionModal
               └→ InGameScreen (슬라이스 기반)
                   └→ ResultScreen

+ SettingsModal (전역 설정 모달)
```

---

## 4. 디렉토리 구조 (MVP 버전)

```
/src
 ┣ /components
 ┃ ┣ /modals
 ┃ ┃ ┗ StageDescriptionModal.tsx
 ┃ ┗ /ui (공통 버튼 등)
 ┣ /pages
 ┃ ┣ SplashScreen.tsx
 ┃ ┣ MainMapScreen.tsx
 ┃ ┣ StageSelectScreen.tsx
 ┃ ┣ InGameScreen.tsx
 ┃ ┗ ResultScreen.tsx
 ┣ /store (zustand 상태 관리)
 ┣ /hooks (제스처 등)
 ┣ /assets (오염물, 효과음 등 리소스)
 ┗ App.tsx / main.tsx
```

---

## 5. 라우팅 예시

```tsx
<Routes>
  <Route path="/" element={<SplashScreen />} />
  <Route path="/main" element={<MainMapScreen />} />
  <Route path="/stage" element={<StageSelectScreen />} />
  <Route path="/game" element={<InGameScreen />} />
  <Route path="/result" element={<ResultScreen />} />
</Routes>

<SettingsModal />
<StageDescriptionModal />
```

---

## 6. MVP 구성 핵심

| 구성 요소        | 설명                                               |
| ---------------- | -------------------------------------------------- |
| 슬라이스 입력    | `@use-gesture/react`로 제스처 감지, `onSwipe` 구현 |
| 이펙트/오염 제거 | `react-konva`로 시각적 오브젝트 표현               |
| 화면 전환        | `framer-motion` + `react-router-dom` 조합          |
| 게임 상태 관리   | `zustand` 사용, 스테이지/스코어 저장               |
| 사운드 효과      | `howler`로 슬라이스/성공음 등 제어                 |

---

## 7. PWA 설정 확인

-   `manifest.json`: 앱 이름, 아이콘, 색상 등 정의
-   `service-worker.js`: 오프라인 지원 (CRA 템플릿에서 자동 포함됨)
-   `meta viewport`: 모바일 최적화 확인
    ```html
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    ```

---

## ✅ 다음 작업

-   [ ] `SplashScreen` 제작 및 자동 전환 구현
-   [ ] `MainMapScreen`에서 맵 진입 버튼 구성
-   [ ] `StageSelectScreen` 구성 (1개만)
-   [ ] 슬라이스 조작 가능한 `InGameScreen` MVP 구현
-   [ ] 정화율 기준으로 `ResultScreen` 표시

---
