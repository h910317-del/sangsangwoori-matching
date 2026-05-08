import { test, expect } from "@playwright/test";
import { resetDb, countSeniors } from "./helpers/db";

test.beforeEach(async () => {
  await resetDb();
});

test("이름 없이 제출 → 빨간 에러 박스 표시, seniors 테이블 미삽입", async ({ page }) => {
  await page.goto("/register");

  // 이름 필드를 비우고 나머지만 입력
  await page.fill("#region", "서울");
  await page.fill("#desired_job", "경비");
  await page.fill("#career_years", "3");

  // HTML required 속성으로 인한 브라우저 기본 검증 해제 → 서버 액션까지 전달
  await page.locator("form").evaluate((form) =>
    (form as HTMLFormElement).setAttribute("novalidate", "")
  );

  await page.click('button[type="submit"]');

  // 서버에서 반환한 에러 메시지 확인 (p[role="alert"] — Next.js route announcer div 제외)
  const alert = page.locator("p[role='alert']");
  await expect(alert).toBeVisible({ timeout: 15_000 });
  await expect(alert).toContainText("이름");

  // DB에 새 시니어 레코드가 없어야 함
  const total = await countSeniors();
  expect(total).toBe(0);
});
