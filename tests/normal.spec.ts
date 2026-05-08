import { test, expect } from "@playwright/test";
import { resetDb, insertJob } from "./helpers/db";

// 지역 +3, 직종 +2, 경력 +1 → 6점 (최고점)
test.beforeEach(async () => {
  await resetDb();
  await insertJob({
    title: "서울 경비원 공고",
    region: "서울",
    job_type: "경비",
    required_career: 3,
  });
});

test("시니어 등록 → 6점 금색 배지 카드가 추천 상단에 표시된다", async ({ page }) => {
  await page.goto("/register");

  await page.fill("#name", "테스트시니어");
  await page.fill("#region", "서울");
  await page.fill("#desired_job", "경비");
  await page.fill("#career_years", "5");

  await page.click('button[type="submit"]');

  // 서버 액션이 /recommendations?senior_id=...&registered=1 로 리다이렉트
  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 30_000 });

  // 성공 초록 배너
  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible();

  // 6점 금색(amber) 배지가 존재하고 첫 번째 카드에 위치
  const goldBadge = page.locator(".bg-amber-100").first();
  await expect(goldBadge).toBeVisible();
  await expect(goldBadge).toContainText("6점");
  await expect(goldBadge).toContainText("★");
});
