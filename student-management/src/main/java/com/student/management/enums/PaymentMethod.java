// cSpell:disable
package com.student.management.enums;

public enum PaymentMethod {
    PAYOS("Cổng thanh toán PayOS (VietQR)"),
    BANK_TRANSFER("Chuyển khoản Ngân hàng"),
    VNPAY("Cổng VNPAY-QR"),
    MOMO("Ví điện tử MoMo"),
    CASH("Tiền mặt tại quầy");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
