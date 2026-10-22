# Face Crop v22 — UAT Checklist

Điền `Pass`, `Fail`, `Blocked` hoặc `N/A` vào cột Kết quả. Mỗi lỗi cần kèm trình duyệt, thiết bị, ảnh kiểm thử và bước tái hiện. Không dùng ảnh khách hàng thật nếu chưa có quyền sử dụng.

## Thông tin phiên kiểm thử

| Trường | Giá trị |
| --- | --- |
| Môi trường | Staging |
| Build/commit | |
| Ngày kiểm thử | |
| Người kiểm thử | |
| Trình duyệt/phiên bản | |
| Thiết bị/hệ điều hành | |

## 1. Upload và quản lý batch

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| U01 | Upload một JPEG/PNG/WebP hợp lệ | Ảnh xuất hiện và tự mở trong editor | |
| U02 | Upload nhiều ảnh | Mở ảnh hợp lệ đầu tiên; mọi thumbnail/tên/ảnh lớn khớp | |
| U03 | File sai định dạng | File bị bỏ qua, batch hợp lệ không bị mất | |
| U04 | File quá giới hạn | Cảnh báo rõ; ứng dụng không treo | |
| U05 | Xóa tất cả ảnh | Trở lại màn hình Upload, không hiện editor trống | |
| U06 | Workspace một ảnh | Không hiện điều khiển áp dụng batch không cần thiết | |
| U07 | Chọn ảnh đích | Hiện đúng Source/Targets; checkbox không đổi ảnh active | |
| U08 | Tên file dài/trùng nhau | Có rút gọn/tooltip; không áp dụng nhầm ảnh | |

## 2. Manual crop

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| M01 | Kéo khung | Khung di chuyển trong giới hạn ảnh | |
| M02 | Resize góc | Resize đúng, không vượt ảnh | |
| M03 | Tỷ lệ 4:5, 1:1, 3:4 | Tỷ lệ pixel chính xác | |
| M04 | Free crop | X/Y/width/height được giữ đúng | |
| M05 | Zoom và vertical position | UI, tọa độ và preview đồng bộ | |
| M06 | Advanced coordinates | Khóa tỷ lệ không bị phá ở giá trị biên | |
| M07 | Bàn phím | Có thể điều chỉnh và focus không bị mất | |
| M08 | Sửa crop đã Accept | Accept cũ bị hủy và yêu cầu review lại | |

## 3. Auto face crop

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| A01 | Một khuôn mặt rõ | Nhận diện, tạo draft và yêu cầu review | |
| A02 | Không có khuôn mặt | Hiện `No face detected`; Manual vẫn dùng được | |
| A03 | Nhiều khuôn mặt | Hiện số mặt và yêu cầu chọn chủ thể | |
| A04 | Mặt nhỏ/nghiêng/che một phần | Không treo; kết quả hoặc fallback trung thực | |
| A05 | Màu da, tuổi và ánh sáng đa dạng | Ghi nhận sai lệch; không tự Accept | |
| A06 | Worker không chạy | MediaPipe compatibility fallback hoạt động | |
| A07 | MediaPipe không chạy | TFJS/CPU fallback hoạt động hoặc báo lỗi rõ | |
| A08 | Model/runtime không tải được | Hiện `Detection unavailable` và nút Manual | |
| A09 | Chuyển ảnh khi đang detect | Kết quả không gắn nhầm ảnh | |
| A10 | Batch Auto | Mỗi ảnh được phân tích độc lập và review riêng | |

## 4. Review và Results

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| R01 | Review Manual crop | Source và crop preview đúng ảnh active | |
| R02 | Review Auto crop | Preview phản ánh đúng mặt đã chọn | |
| R03 | Đóng Review | Trở lại Crop, không mất draft | |
| R04 | Accept | Tạo đúng một result theo version hiện tại | |
| R05 | Review next photo | Mở đúng ảnh chưa duyệt tiếp theo | |
| R06 | Back to editing | Giữ Results và trạng thái accepted | |

## 5. Xuất file

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| E01 | Original crop size | File đúng kích thước crop đã Accept | |
| E02 | Kích thước cố định | PNG/JPEG đúng width và height đã chọn | |
| E03 | Crop to fill cùng tỷ lệ | Không yêu cầu duyệt thừa | |
| E04 | Crop to fill khác tỷ lệ | Khóa download và yêu cầu final review | |
| E05 | Final review một ảnh | Preview lớn, căn giữa, thấy rõ tóc/cằm/vai | |
| E06 | Xác nhận final framing | Chuyển sang `Final framing confirmed`; có `Review again` | |
| E07 | Fit with white background | Giữ toàn bộ crop đã duyệt | |
| E08 | Thay output settings sau xác nhận | Yêu cầu xác nhận final framing lại | |
| E09 | Tải từng ảnh | Tên file, format và kích thước đúng | |
| E10 | Tải ZIP | ZIP mở được, đủ ảnh và có `manifest.csv` đúng | |
| E11 | Batch lớn | Không mất ảnh; có lỗi rõ nếu thiếu bộ nhớ | |

## 6. Responsive và accessibility

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| X01 | Desktop 1366×768 ở zoom 100% | Review dễ thấy; không có phần điều khiển bị che | |
| X02 | Mobile 390×844 | Không tràn ngang; luồng xếp dọc hợp lý | |
| X03 | Tablet | Không chồng cột hoặc modal | |
| X04 | Keyboard only | Thực hiện được upload, chọn ảnh, chỉnh, review và export | |
| X05 | Screen reader | Label, status live và dialog có tên/quan hệ hợp lý | |
| X06 | Zoom 200% | Nội dung không mất hoặc chồng nhau | |
| X07 | Contrast | Text, focus, disabled và error đạt chuẩn dự án | |
| X08 | Touch crop | Kéo crop không chặn cuộn trang ngoài ý muốn | |
| X09 | Shared shell | Nền trang, header, button và How it works khớp design-system build được duyệt | |
| X10 | Editor surface | Nền editor tách biệt nhưng không làm thay đổi nền trang chung | |

## 7. Trình duyệt và độ bền

Kiểm thử tối thiểu phiên bản đang được Printcart hỗ trợ:

| Trình duyệt | Manual | Auto | Review/Results | ZIP | Kết quả |
| --- | --- | --- | --- | --- | --- |
| Chrome desktop | | | | | |
| Edge desktop | | | | | |
| Firefox desktop | | | | | |
| Safari macOS | | | | | |
| Chrome Android | | | | | |
| Safari iOS | | | | | |

Các kiểm tra bổ sung:

- Mạng chậm hoặc model bị lỗi tải.
- Refresh/đóng tab khi còn công việc chưa tải.
- Bộ nhớ thấp và ảnh độ phân giải cao.
- Hai tab chạy đồng thời.
- Download bị trình duyệt chặn.

## 8. Tích hợp Printcart

| ID | Tình huống | Điều kiện đạt | Kết quả |
| --- | --- | --- | --- |
| I01 | Sign in chung | Dùng shared account, không tạo tài khoản Face Crop | |
| I02 | Dashboard chung | Điều hướng đúng scope và không mất dữ liệu ngoài dự kiến | |
| I02a | My Files chung | Mở đúng thư viện và không tạo kho file riêng cho Face Crop | |
| I03 | Token miễn phí | Auto local không phát sinh charge | |
| I04 | Thao tác tính phí nếu có | Báo giá và xác nhận trước; ledger dùng ví chung | |
| I05 | Lưu/khôi phục nếu thuộc MVP | Quyền sở hữu, version và crop khớp | |
| I06 | Online Design nếu thuộc MVP | Chỉ chuyển asset thật đã lưu; retry khi lỗi | |
| I07 | Telemetry | Không ghi raw image, biometric data hoặc credential URL | |

## 9. Điều kiện nghiệm thu production

Chỉ đề nghị mở production khi:

- Tất cả mục bắt buộc đạt hoặc có phê duyệt ngoại lệ bằng văn bản.
- Không còn lỗi blocker/critical/high chưa có biện pháp kiểm soát.
- Chính sách token, persistence, privacy và retention đã được chốt.
- Dependency/license/security review hoàn tất.
- Có rollback plan, monitoring và đầu mối xử lý sự cố.
- Product, Engineering và QA cùng ký xác nhận build cụ thể.
