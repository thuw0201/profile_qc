const questions = [
    {
        category: "Kinh nghiệm & Domain",
        question: "1. Bạn hãy giới thiệu về bản thân và kinh nghiệm liên quan đến hệ thống thanh toán (Payment System)?",
        answer: `
            <p><strong>Cách trả lời:</strong> Trình bày ngắn gọn, đi thẳng vào các dự án có tính chất giao dịch tiền tệ mà bạn đã làm.</p>
            <ul>
                <li>Em có hơn 3 năm kinh nghiệm làm QA/QC, trong đó đặc biệt mạnh ở mảng hệ thống thanh toán và tích hợp.</li>
                <li>Tại dự án gần nhất, em đã thực hiện test tích hợp đa phương thức cho các cổng thanh toán online và ví điện tử, phối hợp với các bank partner như OCB, BVB, mPAY.</li>
                <li>Em nắm vững vòng đời của một giao dịch (Transaction Lifecycle), hiểu về đối soát dữ liệu (Reconciliation) giữa các hệ thống hóa đơn điện tử.</li>
            </ul>
        `,
        tip: "Nhấn mạnh việc bạn không chỉ test UI chức năng mà còn hiểu sâu luồng <span class='keyword'>Đối soát dữ liệu (Reconciliation)</span> và <span class='keyword'>Tích hợp đa phương thức</span>."
    },
    {
        category: "Kinh nghiệm & Domain",
        question: "2. Theo bạn, điểm khác biệt lớn nhất khi test một sản phẩm E-wallet/Payment so với một website E-commerce thông thường là gì?",
        answer: `
            <p><strong>Cách trả lời:</strong> Tập trung vào tính bảo mật, tính nguyên vẹn của dữ liệu và các case bất thường (Edge cases).</p>
            <ul>
                <li><strong>Tính ACID:</strong> Giao dịch thanh toán yêu cầu khắt khe về tính nhất quán dữ liệu (tiền trừ phía KH thì phải cộng phía đối tác, kẹt mạng phải roll-back). e-Commerce báo lỗi thì mua lại được, nhưng Payment báo lỗi thì liên quan đến tiền thật.</li>
                <li><strong>Bảo mật & Luồng bên thứ 3:</strong> Payment luôn phụ thuộc kết nối API với Bank/Partner. Phải test kỹ xử lý <em>Timeout</em>, mất kết nối mạng giữa chừng, token hết hạn.</li>
                <li><strong>Test Concurrent (Đồng thời):</strong> Điều gì xảy ra nếu click thanh toán 2 lần liên tục trong lúc lag?</li>
            </ul>
        `,
        tip: "Bật ra được các keyword: <span class='keyword'>Data Integrity</span>, <span class='keyword'>Idempotent (Tính luỹ đẳng)</span> khi gọi API, <span class='keyword'>Timeout handling</span>."
    },
    {
        category: "Kỹ thuật Test",
        question: "3. Bạn hãy nêu cách bạn lên Test Plan và Test Case cho một tính năng thanh toán qua cổng mPAY?",
        answer: `
            <p><strong>Cách trả lời:</strong> Bám sát quy trình bạn đã làm thực tế, chia ra các tầng để test.</p>
            <ul>
                <li><strong>Phân tích yêu cầu:</strong> Xác định luồng Happy case (Thanh toán thành công) và Unhappy case (Số dư không đủ, timeout, sai OTP...).</li>
                <li><strong>UI/UX:</strong> Hiển thị thông tin giao dịch, số tiền chính xác, redirect đúng trang sau khi thanh toán.</li>
                <li><strong>API & Backend:</strong> Dùng Postman/Swagger giả lập request gọi lên mPAY, giả lập nhận response (Callback/Webhook) từ mPAY trả về xem hệ thống xử lý đúng không.</li>
                <li><strong>Database:</strong> Truy vấn SQL để đảm bảo Transaction ID được ghi nhận, trạng thái update từ Pending -> Success, và số dư người dùng bị trừ khớp.</li>
            </ul>
        `,
        tip: "Đề cập đến việc test giả lập <span class='keyword'>(Mocking/Stubbing) API</span> của bên thứ 3 (mPAY). QC cần biết dùng Postman Mocks để tự test độc lập khi Bank offline."
    },
    {
        category: "Kỹ thuật Test",
        question: "4. Kể tên một vài Negative Test Cases 'kinh điển' (Edge cases) mà bạn dùng khi test thanh toán?",
        answer: `
            <p><strong>Cách trả lời:</strong> Đưa ra các case khó, thực tế và mang tính phá hủy (Destructive).</p>
            <ul>
                <li>Nhập số tiền âm, số tiền 0 đồng, hoặc số tiền rất lớn (vượt hạn mức ngày/tháng).</li>
                <li>Người dùng tắt app hoặc back lại trình duyệt đúng lúc màn hình đang "Processing...".</li>
                <li>Đóng băng mạng (Network throttling) xem API có bị timeout và update sai status ở Database không.</li>
                <li>Kẻ gian đổi số tiền ở Client-side (dùng DevTools sửa value trước khi bấm Submit) -> Backend phải bắt lỗi <em>Invalid Amount</em>.</li>
            </ul>
        `,
        tip: "Show cho họ thấy tư duy: <span class='keyword'>Không bao giờ tin tưởng dữ liệu từ Client-side</span>, backend luôn phải validate lại thông tin tài chính."
    },
    {
        category: "Xử lý tình huống",
        question: "5. Khi bạn tìm thấy lỗi ở luồng thanh toán nhưng Dev nói 'Đó không phải là bug, bên Bank trả về thế', bạn xử lý sao?",
        answer: `
            <p><strong>Cách trả lời:</strong> Thể hiện thái độ chuyên nghiệp, dựa trên bằng chứng (evidence).</p>
            <ul>
                <li>Đầu tiên em sẽ mở tài liệu tích hợp API (API Document) của bên Bank để check lại xem spec có đúng như Dev nói không.</li>
                <li>Em sẽ mở hệ thống log/Postman, chụp lại chính xác Payload đã gửi đi và Response lấy về để có evidence.</li>
                <li>Nếu do Bank trả về thật, em sẽ thảo luận với Dev/BA xem liệu hệ thống của mình có nên <em>Handle lỗi</em> tốt hơn (Ví dụ hiện thông báo thân thiện thay vì để app crash).</li>
            </ul>
        `,
        tip: "Nhấn mạnh tiêu chí: <span class='keyword'>Làm việc dựa trên Data & Specs</span> và hướng tới <span class='keyword'>Trải nghiệm người dùng (UX)</span> tuyệt đối không đổ lỗi."
    },
    {
        category: "Automation & AI",
        question: "6. Trong CV bạn có nhắc đến việc áp dụng AI vào Automation để rút ngắn thời gian Regression test, bạn đã làm điều đó như thế nào?",
        answer: `
            <p><strong>Cách trả lời:</strong> Nêu rõ bài toán thực tế và cách bạn dùng AI hoặc công cụ Automation (Playwright) để giải quyết.</p>
            <ul>
                <li>Ở dự án ATOM em dùng <strong>Playwright</strong> làm framework chính do tính ổn định và tốc độ chạy cross-browser.</li>
                <li>Hệ thống e-learning kết hợp thanh toán liên tục ra feature mới. Thay vì viết script manual mất thời gian, em dùng AI (như GitHub Copilot / ChatGPT) để sinh ra base-code cho Page Object Model (POM) và các test data (Mock data).</li>
                <li>Nhờ vậy, em tiết kiệm được khoảng 30-40% thời gian viết script ban đầu, tập trung thời gian vào việc viết thêm logic Edge-case và tăng độ phủ (Coverage) cho Regression Test.</li>
            </ul>
        `,
        tip: "Đừng nói AI làm hết mọi việc. Hãy thể hiện rằng <span class='keyword'>AI là công cụ hỗ trợ</span> (tạo sinh data, viết base code) còn bạn là người kiểm soát logic & chất lượng cuối."
    },
    {
        category: "Database & Backend",
        question: "7. Khi thực hiện đối soát dữ liệu (Reconciliation) giữa các hệ thống (M-invoice, Misa), bạn thường test những gì?",
        answer: `
            <p><strong>Cách trả lời:</strong> Thể hiện tư duy kiểm soát luồng data nhiều nguồn thay vì chỉ test trên UI.</p>
            <ul>
                <li>Kiểm tra tính nhất quán (Consistency): Mã hóa đơn ở bên Misa (số hóa đơn sinh ra) phải khớp chính xác với Mã đơn hàng (Order ID) trên hệ thống nội bộ ERP và số tiền đã thanh toán ở cổng Payment.</li>
                <li>Em sẽ query SQL trên Database hoặc dùng tool xuất file Excel từ các hệ thống để so khớp (Ví dụ: dùng script hoặc VLOOKUP để tìm ra giao dịch bất thường).</li>
                <li>Test luồng xử lý lệch: Kiểm tra luồng sinh lại hóa đơn tự động hoặc gửi alert cho kế toán khi hệ thống bị lệch dữ liệu do rớt tín hiệu (Delay/Pending status).</li>
            </ul>
        `,
        tip: "Bật ra keyword ăn tiền: <span class='keyword'>Data Consistency</span> (Tính nhất quán dữ liệu), <span class='keyword'>Transaction Mapping</span> (Đối khớp giao dịch)."
    },
    {
        category: "Mobile & Cross-Browser",
        question: "8. Hệ thống thanh toán/ví điện tử thường được sử dụng rất nhiều trên Mobile. Bạn có kinh nghiệm cross-browser và cross-device testing không?",
        answer: `
            <p><strong>Cách trả lời:</strong> Trình bày quy trình và cách phân bổ effort test một cách thông minh.</p>
            <ul>
                <li>Cổng thanh toán yêu cầu hiển thị responsive cực tốt. Với Web App em ưu tiên Chrome, Safari, Firefox. Với Mobile Wallet ưu tiên iOS và Android. Cả các extension ví (MetaMask, Ton...) của Web3.</li>
                <li>Tuy nhiên, để tối ưu thời gian, em sẽ test chi tiết UI & Function (Exhaustive testing) trên 1 trình duyệt/device quy chuẩn (Chrome/Android).</li>
                <li>Sau đó, thực hiện <em>Smoke/Sanity test</em> các luồng thanh toán cốt lõi (Core flow) trên Safari và các thiết bị màn hình nhỏ gọn để check crash/layout.</li>
            </ul>
        `,
        tip: "Nhà tuyển dụng muốn biết cách bạn phân bổ thời gian. Keyword: <span class='keyword'>Sanity Test luồng cốt lõi các platform phụ</span> thay vì test mù quáng trên mọi thiết bị."
    },
    {
        category: "Quy trình chất lượng",
        question: "9. Bạn làm Reporting (Báo cáo lỗi/test) như thế nào để thuyết phục PM hoặc ban giám đốc có thể cho phép Go-live hệ thống?",
        answer: `
            <p><strong>Cách trả lời:</strong> Tập trung vào các chỉ số (Metrics) rõ ràng mang tính quyết định để Go-live.</p>
            <ul>
                <li>Một Test Report của em sẽ không chỉ liệt kê số lượng test case (Pass/Fail) mà tập trung vào Đánh giá rủi ro (Risk Analysis).</li>
                <li>Em sẽ focus vào các chỉ số: Có Blocker/Critical bug nào chưa được fix mở hệ thống không? Tỷ lệ Pass Rate của "Luồng thanh toán lõi" (Core payment flow) có đạt 100% không?</li>
                <li>Đồng thời xác nhận lại danh sách Known issues (Lỗi chấp nhận được, lỗi low priority) và cam kết hoặc kế hoạch hot-fix ở Sprint sau.</li>
            </ul>
        `,
        tip: "Thể hiện tư duy của một người làm <strong>Quality Assurance</strong> chứ không chỉ là <em>Tester</em>: Biết ra <span class='keyword'>quyết định dựa trên rủi ro (Risk-based approach)</span>."
    },
    {
        category: "Xử lý sự cố",
        question: "10. Sau khi Go-live cổng thanh toán, khách hàng báo cáo họ bị trừ tiền nhưng đơn hàng chưa thành công trên App. Bạn sẽ làm gì ngay lập tức?",
        answer: `
            <p><strong>Cách trả lời:</strong> Kịch bản xử lý sự cố khẩn cấp (Incident Response) trên môi trường Production.</p>
            <ul>
                <li>Giữ bình tĩnh và ưu tiên tìm nguyên nhân rễ: Đầu tiên em cần thông tin User ID, thời gian GD, và Bank từ bộ phận CSKH.</li>
                <li><strong>Check Log & DB:</strong> Truy vấn Database xem Transaction status đang là Pending, Failed hay không có bản ghi cào. Đồng thời check Dashboard của đối tác (mPAY/OCB) xem tiền đã thực sự charge chưa.</li>
                <li><strong>Khoanh vùng:</strong> Nếu tiền chưa bị trừ -> Giải thích KH chờ bank hoàn tiền. Nếu tiền bị trừ mà bên hệ thống mình lỗi do không nhận được Webhook -> Báo Dev patch log / resync đơn hàng, báo kế toán có phương án đối soát refund. Đảm bảo user không hoang mang.</li>
            </ul>
        `,
        tip: "Tuyệt đối không hoảng loạn hay chạy đi đổ lỗi. Keyword: <span class='keyword'>Xác thực Log/Webhook</span>, <span class='keyword'>Khoanh vùng sự cố</span>, và <span class='keyword'>Giải quyết trải nghiệm User</span>."
    }
];

let currentIndex = 0;
const totalSlides = questions.length;

// DOM Elements
const sliderContainer = document.getElementById('slider-container');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const progressBar = document.getElementById('progress');
const currentQLabel = document.getElementById('current-q');
const totalQLabel = document.getElementById('total-q');
const categoryBadge = document.getElementById('category-badge');

// Initialize
function init() {
    totalQLabel.textContent = totalSlides;
    questions.forEach((q, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active');

        slide.innerHTML = `
            <div class="question-card">
                <h2>${q.question}</h2>
                <button class="btn-reveal" onclick="revealAnswer(${index})">
                    <i class="fa-solid fa-lightbulb"></i> Xem gợi ý trả lời
                </button>
            </div>
            <div class="answer-area">
                <div class="answer-content">
                    ${q.answer}
                </div>
                <div class="highlight-tip">
                    <strong><i class="fa-solid fa-crown"></i> Mẹo ghi điểm:</strong>
                    ${q.tip}
                </div>
            </div>
        `;
        sliderContainer.appendChild(slide);
    });
    updateUI();
}

function updateUI() {
    // Update labels and progress
    currentQLabel.textContent = currentIndex + 1;
    progressBar.style.width = `${((currentIndex + 1) / totalSlides) * 100}%`;
    categoryBadge.textContent = questions[currentIndex].category;

    // Update buttons
    btnPrev.disabled = currentIndex === 0;
    
    if (currentIndex === totalSlides - 1) {
        btnNext.innerHTML = 'Khởi động lại <i class="fa-solid fa-rotate-right"></i>';
        btnNext.classList.replace('btn-primary', 'btn-success');
    } else {
        btnNext.innerHTML = 'Câu tiếp theo <i class="fa-solid fa-arrow-right"></i>';
        btnNext.classList.remove('btn-success');
        btnNext.classList.add('btn-primary');
    }

    // Update slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next');
        if (index === currentIndex) {
            slide.classList.add('active');
        } else if (index < currentIndex) {
            slide.classList.add('prev');
        } else {
            slide.classList.add('next'); // Added for potential future right-side stacking
        }
    });
}

// Reveal Answer Function (attached globally for the inline onclick)
window.revealAnswer = function(index) {
    const slides = document.querySelectorAll('.slide');
    slides[index].classList.add('show-answer');
};

// Next/Prev Events
btnNext.addEventListener('click', () => {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateUI();
    } else {
        // Restart
        currentIndex = 0;
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('show-answer'));
        updateUI();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateUI();
    }
});

// Initialize the app
init();
