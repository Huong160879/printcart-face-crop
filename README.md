# Printcart Face Crop — Baseline UX/UI v22

Face Crop là bản baseline để đội IT tích hợp vào Printcart và triển khai thử trên staging. Bản này **chưa phải bản nghiệm thu production**.

- Live prototype: https://huong160879.github.io/printcart-face-crop/
- Public repository: https://github.com/Huong160879/printcart-face-crop
- Baseline public commit: `6919c9e04c2d62b4754bfa19bcaefe51e3fcd418`
- Tài liệu tích hợp: [INTEGRATION_HANDOFF.md](INTEGRATION_HANDOFF.md)
- Danh sách UAT: [UAT_CHECKLIST.md](UAT_CHECKLIST.md)
- Giấy phép bên thứ ba: [THIRD_PARTY_NOTICES.md](https://github.com/Huong160879/printcart-face-crop/blob/main/THIRD_PARTY_NOTICES.md)

## Phạm vi baseline

Đang hoạt động trong trình duyệt:

- Upload JPEG, PNG và WebP.
- Manual crop: di chuyển, resize, tỷ lệ, preset và tọa độ nâng cao.
- Auto face crop chạy cục bộ với MediaPipe và TFJS/CPU fallback.
- Trạng thái một mặt, nhiều mặt, không có mặt và lỗi detector.
- Review từng crop trước khi Accept.
- Results, kích thước đầu ra, Crop to fill và Fit with white background.
- Yêu cầu duyệt lại khi tỷ lệ xuất làm thay đổi framing.
- Xuất từng ảnh hoặc ZIP có `manifest.csv`.
- Đánh giá 1–5 sao và nhận xét tối đa 500 ký tự sau khi có Results; prototype lưu theo mã job và phiên bản kết quả chỉ trong trình duyệt.
- Bố cục desktop ba cột và bố cục mobile theo chiều dọc.
- Shared shell theo Upscale: nền trang `#FBFCFE`, header Dashboard/My Files/Shared Token Wallet/Account và component How it works chung.

Chưa được tích hợp production:

- Account, Dashboard và Shared Token Wallet của Printcart.
- Điều hướng thật từ Dashboard/My Files và dữ liệu tài khoản dùng chung.
- Lưu hoặc khôi phục phiên làm việc.
- Ghi nhận usage vào hệ thống Printcart.
- Chuyển kết quả sang Online Design.
- Backend upload, xử lý ảnh hoặc lưu trữ lâu dài.
- Gửi phản hồi về Dashboard/server Printcart.

## Chạy local

Đây là static site. Phải chạy qua HTTP; không mở trực tiếp bằng `file://` vì Worker, WASM và model có thể không tải đúng.

Ví dụ:

```bash
npx http-server dist -p 8080
```

Sau đó mở `http://localhost:8080`.

## Cấu trúc chính

```text
dist/
  index.html                     Bản build chạy độc lập
  app.js                         Logic nguồn trước khi inline
  app.css                        Giao diện nguồn trước khi inline
  face-worker.js                 MediaPipe worker
  models/                        Model nhận diện cục bộ
  vendor/                        MediaPipe, TensorFlow.js và fflate
  THIRD_PARTY_NOTICES.md         Thông báo giấy phép
qa-browser.mjs                   Kiểm thử trình duyệt chức năng
qa-uat.mjs                       Kiểm tra hợp đồng baseline
```

`dist/index.html` đã inline CSS và logic ứng dụng nhưng vẫn tải Worker, model và thư viện từ các thư mục tương đối. Khi triển khai phải giữ nguyên cấu trúc `dist/`.

## Quy tắc sản phẩm quan trọng

- Auto chỉ tạo draft; mọi kết quả đều cần người dùng review.
- Không mô tả Auto là đã xử lý hoặc duyệt thành công khi detector thất bại.
- Auto chạy trên thiết bị không mặc định trừ token.
- Nếu dịch vụ tính phí được bổ sung, phải dùng ví chung, báo chi phí và yêu cầu xác nhận trước khi trừ.
- Không tạo Account, Wallet hoặc Dashboard riêng cho Face Crop.
- Download request không phải xác nhận trình duyệt đã lưu file thành công.

## Điều kiện phát hành

Baseline này được dùng để tích hợp và UAT trên staging. Chỉ mở production sau khi hoàn tất [UAT_CHECKLIST.md](UAT_CHECKLIST.md), kiểm tra bảo mật/quyền riêng tư, chính sách token và các kết nối dùng chung của Printcart.
