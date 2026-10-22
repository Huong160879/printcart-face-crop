# Face Crop v22 — Integration Handoff

## 1. Mục tiêu bàn giao

Giữ nguyên baseline UX/UI và nối Face Crop vào hạ tầng chung của Printcart trên staging. Không thiết kế lại luồng chính và không biến các bề mặt mô phỏng thành trạng thái “đã xử lý thật” khi chưa có dịch vụ tương ứng.

Luồng cần giữ:

`Upload → Crop (Manual/Auto) → Review → Results → Final export review → Download`

## 2. Ranh giới chạy thật hiện tại

| Thành phần | Trạng thái baseline |
| --- | --- |
| Upload và đọc ảnh | Chạy thật, cục bộ trong tab |
| Manual crop | Chạy thật bằng Canvas |
| Auto face detection | Chạy thật trên thiết bị; MediaPipe và TFJS/CPU fallback |
| Review và Accept | Chạy thật, nhưng là xác nhận của người dùng |
| Resize/fit/format | Chạy thật trong trình duyệt |
| ZIP và `manifest.csv` | Chạy thật trong trình duyệt |
| Account/Dashboard/Wallet | Chỉ là bề mặt tích hợp, chưa kết nối |
| Lưu/khôi phục công việc | Chưa có |
| Online Design handoff | Chưa có |
| Backend processing | Không có trong baseline |

## 3. Điểm IT cần tích hợp

### 3.1 Header, Account và Dashboard

- Thay header prototype bằng shared Printcart header/component.
- Nút Sign in dùng luồng xác thực chung.
- Dashboard trỏ về Dashboard chung; không tạo Dashboard riêng.
- Trạng thái đăng nhập không được làm mất crop draft đang có trong tab.

### 3.2 Shared Token Wallet

- Auto hiện chạy trên thiết bị và không mặc định tiêu thụ token.
- Chỉ hiển thị chi phí khi một dịch vụ tính phí thực sự được gọi.
- Trước thao tác tính phí phải hiển thị chi phí, số dư liên quan và yêu cầu xác nhận.
- Reservation, charge, refund và ledger phải dùng dịch vụ ví chung; Face Crop không giữ số dư riêng.
- Không trừ token cho thao tác UI, Manual crop, review hoặc download cục bộ.

### 3.3 Lưu và khôi phục công việc

Baseline chỉ giữ dữ liệu trong bộ nhớ của tab. Nếu MVP yêu cầu persistence, IT cần chốt:

- Phạm vi sở hữu: user, store hoặc organization.
- Thời hạn lưu và chính sách xóa.
- Ảnh nguồn, crop geometry, accepted version và export settings cần lưu ở đâu.
- Cơ chế signed upload/download và kiểm soát quyền truy cập.
- Hành vi khi ảnh nguồn bị xóa hoặc phiên bản crop không còn khớp.

Không ghi ảnh hoặc Blob URL của trình duyệt trực tiếp vào log.

### 3.4 Usage và observability

Các event đề xuất:

| Event | Dữ liệu tối thiểu |
| --- | --- |
| `face_crop_workspace_opened` | user/store scope, app version |
| `face_crop_photo_added` | MIME, kích thước pixel, dung lượng; không gửi nội dung ảnh |
| `face_crop_detection_finished` | success/none/multiple/error, runtime, thời gian |
| `face_crop_review_accepted` | mode Manual/Auto, ratio, preset |
| `face_crop_export_requested` | số lượng, kích thước, format, fit |
| `face_crop_export_failed` | error code và giai đoạn |

Không gửi tên file đầy đủ hoặc dữ liệu khuôn mặt nếu chưa được phê duyệt về quyền riêng tư.

### 3.5 Online Design handoff

Nếu nằm trong MVP:

- Chỉ chuyển crop đã Accept và, khi cần, đã xác nhận final framing.
- Tạo asset thật trong hệ thống Printcart trước khi mở Online Design.
- Truyền asset ID/URL có quyền truy cập, width, height, MIME và source crop metadata.
- Nếu handoff thất bại, giữ Results và cho phép retry; không hiển thị thành công giả.

## 4. Mô hình trạng thái cần bảo toàn

Mỗi ảnh có các nhóm trạng thái độc lập:

- Active/editing: ảnh đang mở trong editor.
- Selected/target: ảnh được tick để áp dụng framing hàng loạt.
- Detection: idle, detecting, single, multiple, none hoặc error.
- Review: chưa duyệt hoặc accepted theo một version crop cụ thể.
- Export: output settings và final framing confirmation.

Thay đổi crop, tỷ lệ, preset hoặc vị trí sau Accept phải hủy Accept cũ. Thay đổi tỷ lệ xuất với Crop to fill phải yêu cầu xác nhận final framing mới trước khi download.

## 5. Hợp đồng dữ liệu đề xuất

Đây là đề xuất tích hợp, **không phải API đã tồn tại**:

```json
{
  "jobId": "string",
  "ownerScope": {"type": "user|store|organization", "id": "string"},
  "sourceAssetId": "string",
  "crop": {"x": 0.1, "y": 0.08, "width": 0.8, "height": 0.8},
  "ratio": "4/5|1/1|3/4|free",
  "preset": "Head & shoulders|Tight headshot|Upper body",
  "mode": "manual|auto",
  "acceptedVersion": 1,
  "export": {"width": 1000, "height": 1000, "format": "png", "fit": "fill|contain"}
}
```

Tọa độ crop là giá trị chuẩn hóa `0..1` theo ảnh nguồn. Backend phải kiểm tra lại giới hạn, loại file, kích thước và quyền truy cập; không tin dữ liệu từ trình duyệt.

## 6. Lỗi cần hiển thị trung thực

- Model/runtime không tải được: `Detection unavailable`, cho phép tiếp tục Manual.
- Không có mặt: `No face detected`, không gọi đó là lỗi xử lý ảnh.
- Nhiều mặt: yêu cầu người dùng chọn, không tự duyệt một người.
- Thiếu bộ nhớ hoặc file quá lớn: giữ các ảnh hợp lệ khác trong batch.
- Upload/save/handoff thất bại: báo retry và không tạo trạng thái thành công giả.
- Download request: nhắc người dùng kiểm tra browser downloads.

## 7. Bảo mật và quyền riêng tư

- Baseline xử lý ảnh trong trình duyệt và không upload ảnh.
- Khi thêm backend, cần data-flow review, retention policy, access control và audit log.
- Thiết lập CSP phù hợp cho Worker, WASM và model cục bộ.
- Không tải runtime/model từ CDN không được duyệt.
- Quét dependency và duy trì third-party notices khi nâng phiên bản.
- Không log raw image, crop Blob, biometric template hoặc URL có credential.

## 8. Điều kiện staging và production

Staging có thể bắt đầu khi shared header/auth, cấu hình môi trường và telemetry tối thiểu đã sẵn sàng. Production chỉ được nghiệm thu khi toàn bộ mục bắt buộc trong [UAT_CHECKLIST.md](UAT_CHECKLIST.md) đạt và các quyết định về persistence, token, privacy và Online Design đã được ký xác nhận.
