import { test, expect } from "@playwright/test";
import { resetDb, insertJob } from "./helpers/db";

// 점수 계산: region 불일치(0) + job_type 불일치(0) + career 불충족(3 < 10 → 0) = 0점
// ※ 명세의 required_career=0 은 career 체크(3≥0)를 통과해 1점이 되므로 실제 0점을 보장하려면 10으로 설정
test.beforeEach(async () => {
  await resetDb();
  await insertJob({
    title: "기타 공고",
    region: "기타",
    job_type: "기타",
    required_career: 10,
  });
});

test("매칭되는 공고 없음 → '현재 매칭되는 일자리가 없습니다' 안내 표시", async ({ page }) => {
  await page.goto("/register");

  await page.fill("#name", "테스트시니어2");
  await page.fill("#region", "서울");
  await page.fill("#desired_job", "경비");
  await page.fill("#career_years", "3");

  await page.click('button[type="submit"]');

  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 30_000 });

  // 매칭 없음 안내 박스
  await expect(page.getByText("현재 매칭되는 일자리가 없습니다")).toBeVisible();
});
