# Hướng dẫn thiết lập hệ thống thanh toán

## Chuẩn bị logo thanh toán

Tải và lưu các logo thanh toán vào thư mục này:
- momo-logo.png
- vnpay-logo.png

## Thiết lập tài khoản MoMo và VNPay

### 1. Thiết lập MoMo Payment

1. Đăng ký tài khoản merchant tại [MoMo Business](https://business.momo.vn/)
2. Sau khi được phê duyệt, bạn sẽ nhận được các thông tin cấu hình:
   - Partner Code
   - Access Key
   - Secret Key
3. Cập nhật các thông tin này vào file `.env` trong thư mục Backend:
   ```
   MOMO_PARTNER_CODE=your_partner_code
   MOMO_ACCESS_KEY=your_access_key
   MOMO_SECRET_KEY=your_secret_key
   MOMO_RETURN_URL=http://localhost:3000/payment/momo-return
   MOMO_NOTIFY_URL=http://your_backend_url/api/payment/momo/callback
   ```

### 2. Thiết lập VNPay

1. Đăng ký tài khoản merchant tại [VNPay Business](https://sandbox.vnpayment.vn/merchantv2/)
2. Sau khi được phê duyệt, bạn sẽ nhận được các thông tin cấu hình:
   - Terminal ID (vnp_TmnCode)
   - Secret Key (vnp_HashSecret)
3. Cập nhật các thông tin này vào file `.env` trong thư mục Backend:
   ```
   VNPAY_TMN_CODE=your_terminal_id
   VNPAY_HASH_SECRET=your_hash_secret
   VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay-return
   ```

## Môi trường test (Sandbox)

Trong môi trường phát triển, bạn nên sử dụng các URL sandbox để kiểm thử:

- MoMo: https://test-payment.momo.vn/v2/gateway/api/create
- VNPay: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

## Phương thức thanh toán MoMo

- **Số điện thoại test**: 0123456789
- **OTP**: 000000

## Phương thức thanh toán VNPay

- **Thẻ Ngân hàng test**: NCB
- **Số thẻ**: 9704198526191432198
- **Tên chủ thẻ**: NGUYEN VAN A
- **Ngày phát hành**: 07/15
- **OTP**: 123456

## Chuyển sang môi trường sản xuất

Khi ứng dụng sẵn sàng cho sản xuất, thay đổi các URL sang môi trường sản xuất trong file `.env`:

```
# MoMo Production
MOMO_API_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create
MOMO_QUERY_API=https://payment.momo.vn/v2/gateway/api/query

# VNPay Production
VNPAY_URL=https://pay.vnpay.vn/vpcpay.html
```

**Lưu ý**: Trước khi chuyển sang môi trường sản xuất, đảm bảo bạn đã hoàn tất các bước xác minh và được phê duyệt bởi MoMo và VNPay. 