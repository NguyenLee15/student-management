package com.example.student.management.enums;

public enum  Dot {
    D1("1"),
    D2("2"),
    D3("3");

    private final String dothoc;

    Dot (String dothoc) {
        this.dothoc = dothoc;
    }

    public String getDotHoc() {
        return dothoc;
    }
}
