package com.student.management;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.student.management.entity.User;
import com.student.management.enums.Role;
import com.student.management.repository.UserRepository;

import org.springframework.context.annotation.Profile;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class StudentManagementApplication {

	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}

	public static void main(String[] args) {
		SpringApplication.run(StudentManagementApplication.class, args);
	}

	@Bean
    @Profile("!test")
    public CommandLineRunner initDatabase(
            UserRepository userRepository, 
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // Tên tài khoản admin bạn muốn tạo
            String adminUsername = "admin";

            // 1. Kiểm tra xem user 'admin' đã tồn tại chưa
            if (userRepository.findByUserName(adminUsername).isEmpty()) {
                
                // 2. Nếu chưa, tạo user mới
                User admin = new User();
                admin.setUserName(adminUsername);
                
                // 3. Mã hóa mật khẩu trước khi lưu
                // Tuyệt đối KHÔNG lưu "admin123"
                admin.setPassword(passwordEncoder.encode("admin123")); 
                
                // 4. Gán vai trò (role)
                // (Phụ thuộc vào thiết kế User entity của bạn)
                admin.setRole(Role.ADMIN); 

                // 5. Lưu user vào CSDL
                userRepository.save(admin);
                
        };
		};
	}

}

