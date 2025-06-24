package com.example.student.management.controller;

import com.example.student.management.config.JwtTokenProvider;
import com.example.student.management.dto.req.User_DTO_Req;
import com.example.student.management.dto.resp.User_DTO_Resp;
import com.example.student.management.exception.BadRequestException;
import com.example.student.management.service.User_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private User_Service userService;

    // Hiển thị trang login
    @GetMapping
    public String showLoginPage(Model model, 
                               @RequestParam(value = "error", required = false) String error,
                               @RequestParam(value = "logout", required = false) String logout) {
        if (error != null) {
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "Sai tên đăng nhập hoặc mật khẩu");
        }
        if (logout != null) {
            model.addAttribute("logout", true);
            model.addAttribute("logoutMessage", "Đăng xuất thành công");
        }
        return "login";
    }

    // Xử lý đăng nhập
    @PostMapping
    public String login(@ModelAttribute("loginRequest") User_DTO_Req loginRequest, 
                       Model model, 
                       HttpServletResponse response) {
        try {
            System.out.println("Received loginRequest: userName=" + loginRequest.getUserName() + ", password=" + loginRequest.getPassword());
            if (loginRequest.getUserName() == null || loginRequest.getUserName().trim().isEmpty()) {
                throw new BadRequestException("Tên đăng nhập không được để trống");
            }
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                throw new BadRequestException("Mật khẩu không được để trống");
            }

            String username = loginRequest.getUserName().trim();
            System.out.println("Attempting login with username: " + username);

            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    username,
                    loginRequest.getPassword()
                )
            );

            User_DTO_Resp user = userService.findByUserName(username)
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));
            System.out.println("Found user: " + user.getUserName());

            String jwt = jwtTokenProvider.generateToken(user.getUserName(), user.getRole().name());
            System.out.println("Generated JWT: " + jwt);

            Cookie jwtCookie = new Cookie("jwt-token", jwt);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60);
            response.addCookie(jwtCookie);

            System.out.println("Redirecting to /home for user: " + user.getUserName());
            return "redirect:/home";
        } catch (BadRequestException e) {
            System.err.println("BadRequestException: " + e.getMessage());
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", e.getMessage());
            return "login";
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "Sai tên đăng nhập hoặc mật khẩu: " + e.getMessage());
            return "login";
        }
    }

    // Xử lý đăng xuất
    @GetMapping("/logout")
    public String logout(HttpServletResponse response) {
        // Xóa JWT cookie
        Cookie jwtCookie = new Cookie("jwt-token", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        response.addCookie(jwtCookie);

        return "redirect:/login?logout";
    }
}