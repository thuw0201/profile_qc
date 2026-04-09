https://playwrightvn.com/blog/suu-tam-mot-so-cau-hoi-phong-van-playwright/ 

# Câu Hỏi Phỏng Vấn Playwright

Dưới đây là phần giải đáp cho các câu hỏi phỏng vấn cơ bản về `Playwright`, được trình bày theo dạng hỏi - đáp dễ hiểu để bạn ôn tập.

---

## Mục Lục
- [1. Cơ bản về Playwright](#1-cơ-bản-về-playwright)
- [2. Selectors và Locators](#2-selectors-và-locators)
- [3. Basic Actions](#3-basic-actions)
- [4. Test Organization (Intermediate)](#4-test-organization-intermediate)
- [5. Configuration & Assertions (Intermediate)](#5-configuration--assertions-intermediate)
- [6. Xử lý Tình Huống Thực Tế (Advanced)](#6-xử-lý-tình-huống-thực-tế-advanced)

---

## 1. Cơ bản về Playwright

### Playwright là gì? So sánh với Selenium?
- **Playwright là gì**: Playwright là một công cụ mã nguồn mở do Microsoft phát triển, được sử dụng để kiểm thử tự động (Automation Testing) end-to-end cho các ứng dụng web. Nó giúp mô phỏng chính xác các thao tác của người dùng.
- **So sánh với Selenium**:
  1. **Cơ chế hoạt động & Tốc độ**: Playwright giao tiếp trực tiếp với trình duyệt thông qua giao thức debugger (Chrome DevTools Protocol) thay vì thông qua WebDriver trung gian như Selenium. Điều này giúp tốc độ chạy test của Playwright nhanh hơn đáng kể.
  2. **Auto-wait (Tự động chờ)**: Playwright sẽ tự động chờ các phần tử (element) xuất hiện, có thể click được và ổn định trước khi thao tác. Selenium thì sinh ra các lỗi `ElementNotInteractable` nếu không config thêm Explicit/Implicit wait thủ công.
  3. **Browser Context (Đa ngữ cảnh)**: Thế mạnh cốt lõi. Playwright khởi tạo các "Browser Context" cực kỳ nhanh, giúp chạy song song nhiều bài test trên cùng 1 browser bằng cách tạo các session/tab độc lập hoàn toàn (như mở tab ẩn danh mới). Rất dễ test nhiều roles phân quyền cùng lúc.
  4. **Network Interception**: Playwright hỗ trợ "phá bĩnh" và chỉnh sửa network request/response dễ dàng (Mock API) mà Selenium thường gặp khó khăn.

### Playwright hỗ trợ những browser nào?
- Hỗ trợ 3 browser engine chính:
  - **Chromium** (bao gồm Google Chrome, Microsoft Edge)
  - **WebKit** (mô phỏng Apple Safari)
  - **Firefox**

### Cài đặt và setup project Playwright như thế nào?
Cài đặt rất nhanh gọn bằng một cú pháp (yêu cầu máy có NodeJS):
```bash
npm init playwright@latest
```
Bộ cài đặt này sẽ hỏi bạn một vài tuỳ chọn, sau đó tự động:
- Khởi tạo project (tạo package.json).
- Tải về gói thư viện `@playwright/test`.
- Tải xuống sẵn các binaries của Chromium, Firefox, WebKit để sẵn sàng sử dụng.
- Sinh ra file config chuẩn (`playwright.config.ts`) và thư mục `tests` chứa ví dụ cơ bản.

### Cấu trúc cơ bản của một test case Playwright?
Sử dụng hàm `test` và thực hiện kịch bản theo mô hình A-A-A (Arrange - Act - Assert).
```javascript
import { test, expect } from '@playwright/test';

test('Kiểm tra chức năng Đăng Nhập thành công', async ({ page }) => {
  // 1. Arrange: Mở trang
  await page.goto('https://example.com/login');
  
  // 2. Act: Thao tác nhập liệu & Click
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Log in' }).click();

  // 3. Assert: Xác nhận kết quả
  await expect(page.getByText('Welcome, testuser')).toBeVisible();
});
```

---

## 2. Selectors và Locators

### Các loại locator trong Playwright? Ưu nhược điểm từng loại?
Playwright ưu tiên sử dụng locator "Hợp với người dùng - User-Facing Locators".
- **`getByRole`**: *Khuyên dùng hàng đầu*. Tìm button, link, heading. Ưu điểm là chuẩn theo thuộc tính Web Accessibility (A11y). Nhược điểm là bạn cần nắm rõ concept DOM role.
- **`getByText`**: Rất tự nhiên, tìm đúng text mà mắt người nhìn thấy. Nhược điểm: Dễ bị gãy (flaky) khi ứng dụng thay đổi nội dung text đa ngôn ngữ.
- **`getByLabel` / `getByPlaceholder`**: Thường dùng tốt cho thẻ input form.
- **`getByTestId`**: Tìm thông qua các chuỗi như `data-testid="submit-btn"`. Cực kỳ ổn định (ổn định nhất) qua mọi bản cập nhật UI/ngôn ngữ. Nhược điểm: Cần phía lập trình viên hỗ trợ chèn thuộc tính này vào code dạo diện.
- **Xpath / CSS (`page.locator('.class')`)**: Rất linh hoạt và mạnh mẽ cho mọi cấu trúc HTML. Nhược điểm là rất dễ vỡ rụng (flaky) mỗi khi Front-End tổ chức lại các thẻ HTML (thêm/bớt div).

### Viết selector cho element có text “Submit”
Có hai cách phổ biến:
- Chuẩn role: `page.getByRole('button', { name: 'Submit' })`
- Vị trí chung chung: `page.getByText('Submit', { exact: true })`

### Làm sao để locate element trong shadow DOM?
Điểm sáng của Playwright là nó **mặc định tự động đi xuyên qua (pierce)** lớp vỏ Shadow DOM bằng bộ máy CSS selector của nó (mà không cần hack code phức tạp như Selenium). 
Bạn cứ viết locator như bình thường:
```javascript
page.locator('my-custom-element .internal-button')
```

### page.locator() vs page.$() khác nhau gì?
Đây là một cạm bẫy phỏng vấn rất hay hỏi:
- `page.locator()` **(Khuyên dùng)**: Đặc tính là "Lười biếng" (Lazy). Khi bạn gọi hàm này, nó chưa tìm trên web ngay, nó chỉ thiết lập cái bẫy. Phải đến khi bạn thực thi một thao tác như `.click()` nó mới bắt đầu quét DOM. Nó sẽ tự động auto-retry nếu Element chưa load xong. Tránh được hoàn toàn lỗi Stale Element.
- `page.$()` **(Không khuyên dùng nữa)**: Đặc tính "Tức thì". Khi thực thi xong dòng code, nó chốt hạ ElementHandle tại thời điểm đó. Nếu 1 mili-giây sau giao diện load lại thì biến vừa lưu trữ sẽ hỏng (bị Stale). 

---

## 3. Basic Actions

### Click, fill text, select dropdown trong Playwright
- **Click**:
  ```javascript
  await page.getByRole('button', { name: 'Save' }).click();
  // Dùng { force: true } nếu code bị chèn layer ngăn cản
  ```
- **Fill text** (Nhập dữ liệu vào input):
  ```javascript
  await page.getByPlaceholder('Địa chỉ email').fill('thu@atomsolution.vn');
  ```
- **Select dropdown** (với thẻ `<select>`):
  ```javascript
  // Chọn theo giá trị Value (trong html attribute)
  await page.locator('select#months').selectOption('12'); 
  // Hoặc Chọn theo chữ cái hiển thị (Label)
  await page.locator('select#months').selectOption({ label: 'December' });
  ```

### Chờ element xuất hiện như thế nào?
Mọi hàm hành động (như `click`, `fill`) và kiểm thử (như `expect(locator).toBeVisible()`) đều đã được tích hợp **Auto-wait**. Nó sẽ tự chờ 30 giây mặc định đến khi element "Có mặt, Nhìn thấy được, Không bị overlay đè lấp".
Tuy nhiên nếu bị bắt buộc phải chờ một trạng thái mà không có hành động ngay, dùng:
```javascript
await page.locator('.modal-loading').waitFor({ state: 'visible' }); 
// Hoặc chờ biến mất
await page.locator('.spinner').waitFor({ state: 'hidden' });
```

### Làm sao để verify text/attribute của element?
Sử dụng câu lệnh `expect` (Web-First Assertions):
- **Verify Text**:
  ```javascript
  await expect(page.locator('.alert-success')).toHaveText('Tạo user thành công'); // Khớp hoàn toàn
  await expect(page.locator('.alert-success')).toContainText('thành công'); // Chứa một phần
  ```
- **Verify Attribute / Class**:
  ```javascript
  // Có chứa href đúng link ảnh
  await expect(page.locator('a.download')).toHaveAttribute('href', /invoice.pdf/);
  // Box dropdown đã được bật ra chưa
  await expect(page.locator('.dropdown-menu')).toHaveClass(/show/);
  ```

### Upload file và handle dialog boxes
- **Upload file**: 
  Thao tác thẳng bằng `setInputFiles` xuống thẻ input (`type="file"`). Đừng cố mô phỏng ấn mở Window File Explorer.
  ```javascript
  await page.getByLabel('Tải lên CV').setInputFiles('data/CV_QAQC_Thunguyen.pdf');
  ```

- **Handle Dialog boxes** (Popup hộp thoại mặc định của trình duyệt Alert, Confirm, Prompt):
  - **Lưu ý**: Playwright theo quy tắc "Thấy popup là âm thầm bấm Cancel bỏ qua hết" để không bị treo test.
  - VÌ VẬY, nếu test case của bạn yêu cầu bấm OK vào hộp thoại "Bạn có chắc muốn xoá?" thì phải Cắm một bộ thu tín hiệu (listener) vào trước khi click nút sinh ra popup:
  ```javascript
  // Bật bộ thu (listener) trước
  page.on('dialog', async dialog => {
    console.log('Nội dung:', dialog.message());
    await dialog.accept(); // Lệnh chấp nhận (Bấm OK)
  });
  
  // Sau đó mới click nút (nút này sẽ gọi ra cái popup)
  await page.getByRole('button', { name: 'Xoá' }).click();
  ```

---

## 4. Test Organization (Intermediate)

### Page Object Model (POM) trong Playwright implement như thế nào?
- **Page Object Model** là một design pattern giúp tách biệt phần giao diện (các locators của UI) và phần kịch bản kiểm thử (Test Flow).
- **Cách implement**: Ta sẽ tạo một `Class` đại diện cho một trang (ví dụ `LoginPage`), chứa các biến (locators) và các hàm hành động cụ thể trên trang đó (như `login(user, pass)`).
- **Lợi ích**: Khi UI thay đổi (ví dụ đổi ID của nút Login), ta chỉ cần vào file Class để cập nhật đúng một chỗ, thay vì phải sửa hàng chục test script.
- *Ví dụ:*
  ```javascript
  // file: LoginPage.js
  export class LoginPage {
    constructor(page) {
      this.page = page;
      this.usernameInput = page.getByLabel('Username');
      this.passwordInput = page.getByLabel('Password');
      this.loginBtn = page.getByRole('button', { name: 'Login' });
    }
    
    async login(user, pass) {
      await this.usernameInput.fill(user);
      await this.passwordInput.fill(pass);
      await this.loginBtn.click();
    }
  }
  ```

### Test fixtures và hooks trong Playwright
- **Hooks (`test.beforeEach`, `test.afterEach`, `test.beforeAll`, `test.afterAll`)**: Chứa những đoạn code chung cần chạy trước hoặc sau test case. Ví dụ: trước mỗi test thì gọi `await page.goto('/home')`.
- **Fixtures (Thế mạnh cực lớn của Playwright so với Cypress/Selenium)**: Giúp cô lập môi trường test, thiết lập sẵn những điều kiện hoặc dữ liệu (ví dụ khởi tạo sẵn đối tượng `LoginPage` hoặc data người dùng). Fixture chạy một cách độc lập cho mỗi test worker, cung cấp sẵn các object vào hàm test dưới dạng biến (destructuring) mà không dùng biến global.

## 5. Configuration & Assertions (Intermediate)

### Parallel testing và cách configure
- Playwright mặc định tự động cấu hình chạy Test song song (Parallel) qua các `Workers`.
- Có thể config ở file `playwright.config.ts`:
  ```javascript
  export default defineConfig({
    // Chỉ định số lượng luồng worker chạy song song
    // CI thường dùng 1 luồng, máy local có thể dùng nhiều (ví dụ bằng 50% số CPU core)
    workers: process.env.CI ? 1 : undefined,
    // Cho phép chạy test bên trong cùng một file một cách song song
    fullyParallel: true,   
  });
  ```

### Data-driven testing với Playwright
- Dùng để chạy cùng một test case nhưng với nhiều bộ dữ liệu (test data) khác nhau, nhằm test vét cạn được các Boundary Value/Equivalence Partitioning.
- Thay vì viết 10 cái test y hệt nhau, ta thường tạo một mảng Array data bên ngoài, sau đó dùng lệnh lặp `for...of` vòng quanh hàm `test()` để auto-generate ra các testcase.
- *Ví dụ:*
  ```javascript
  const users = ['valid_user', 'locked_out_user', 'problem_user'];
  for (const user of users) {
    test(`Testing login với user: ${user}`, async ({ page }) => {
       await page.fill('#user-name', user);
       // ... assert ...
    });
  }
  ```

### playwright.config.js cấu hình những gì?
File này dùng để định cấu hình "Bộ não" của framework. Gồm những thông số lớn như:
- **`Timeout`**: Thời gian tối đa để chạy 1 test (mặc định 30s) hoặc 1 lệnh expect (5s).
- **`Retries`**: Cấu hình tự động chạy lại bao nhiêu lần nếu test đó bị xịt (Fail). Rất hữu ích xử lý cho Flaky test.
- **`use`**: Các cấu hình được áp dụng cho toàn project: `baseURL` (link hệ thống gốc), `headless: true/false` (chạy ẩn màn hình), quay video (`video: 'on-first-retry'`), tự lưu screenshot lúc test lỗi.
- **`projects`**: Nơi bạn chia nhỏ test theo các loại trình duyệt (Chrome, Safari, Firefox, Giả lập iOS, Android).

### Soft assertions vs hard assertions
- **Hard Assertions** (`expect(..)`): Mặc định của Playwright. Nếu điều kiện `expect` này sai, Framework sẽ lập tức DỪNG luồng chạy và đánh dấu Test Fail luôn. Điểm cộng: Dừng sớm, đỡ tốn effort.
- **Soft Assertions** (`expect.soft(..)`): Khá hay khi kiểm tra nhiều UI elements ít quan trọng. Nếu một bước có `soft` bị báo lỗi, Playwright chỉ Note lại lỗi (log) rồi vẫn **chạy tiếp tục** các lệnh `expect` bên dưới cho đến hết khối lệnh test.

---

## 6. Xử lý Tình Huống Thực Tế (Advanced)

### "Làm sao test một trang web có lazy loading (cuộn đến đâu load data đến đấy)?"
Vấn đề với trang lazy-loading là phần tử nằm tít ở dưới chưa được sinh ra trên mô hình DOM.
- **Cách xử lý**: Gọi hàm yêu cầu Playwright scroll chuột xuống, ví dụ `await page.mouse.wheel(0, 1000)` hoặc móc vào 1 element mốc cuối trang gọi `await locator.scrollIntoViewIfNeeded()`.
- **Tuyệt chiêu đợi**: Kết hợp hành động scroll với `await page.waitForResponse('/api/load-more')` để đợi API Backend trả cục dữ liệu tiếp theo về hoàn tất rồi mới verify UI.

### "Handle authentication (Đăng nhập) trong E2E tests"
Ở framework thông thường, với 100 test case yêu cầu cần Login, trình duyệt sẽ phải chạy flow Login (gõ ID/Pass) 100 lần, gây tốn rất nhiều thời gian.
- **Cách Playwright xử lý (Global Setup)**: Playwright cung cấp tính năng lưu trữ "Trạng thái Storage". 
- Ta chỉ chạy luồng Login đúng 1 lần duy nhất bằng 1 API request hoặc UI test, lấy toàn bộ Cookie/Token lưu và "nhét" vào 1 file tên là `auth.json`. 
- Sau đó cài đặt `config.use: { storageState: 'auth.json' }`. Ở mọi test case tiếp theo, browser sẽ luôn được load kèm cái file json này và auto vượt rào (bypass) trang Đăng Nhập luôn.

### Intercept/Modify network requests (Chặn và sửa data)
Khi Server/Bank Partner của hệ thống đang bảo trì, bạn không cần Backend gốc vẫn có thể test UI bình thường bằng tính năng Mock API đỉnh cao của Playwright:
```javascript
// Nếu Client gọi API lấy danh sách ngân hàng, chặn lại không cho Backend thực hiện mả trả data ảo giả vờ
await page.route('**/api/v1/banks', async route => {
  const json = [{ id: 1, name: 'TienPhongBank Fake' }];
  await route.fulfill({ json });
});
```

### "Đừng dùng networkidle !!!"
*Đây là câu hỏi đào sâu về tư duy mà blog PlaywrightVN thường nhấn mạnh.*
- Nhiều bạn mới học thích dùng lệnh `await page.waitForLoadState('networkidle')` để đợi trang load xong (chờ đến khi không còn API network nào gọi ít nhất trong nửa giây).
- Lý do Không Khuyên Dùng:
  - Ở web hiện đại, có cả tá tool tracking (Google Analytics, Mixpanel, Firebase) liên tục gọi poll/ping định kỳ dưới background không bao giờ ngừng lại.
  - Sóng ngầm này làm cho trạng thái `networkidle` không bao giờ đạt được trước `Timeout`. Hậu quả: Test của bạn sẽ Fail vì chờ đợi mỏi mòn.
- **Giải pháp đúng**: Luôn dựa trên UI Element. Cần trang hiển thị lên, bạn chỉ cần dùng `expect(page.getByRole('heading', {name: 'Dashboard'})).toBeVisible()`. Mọi thứ sẽ auto-wait chuẩn xác nhất.
