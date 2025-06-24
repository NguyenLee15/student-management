package com.example.student.management;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnectionCheker {
    public static void main(String[] args) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/studentmanager?useSSL=false&serverTimezone=UTC";
        String username = "ngocthoa";
        String password = "123456";

        try (Connection conn = DriverManager.getConnection(jdbcUrl, username, password)) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("✅ Successfully connected to database!");
            }
        }
        catch (SQLException e) {
                    System.out.println("❌ Connection failed: " + e.getMessage());
                }
            }
}
