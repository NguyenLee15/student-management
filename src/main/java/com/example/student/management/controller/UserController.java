package com.example.student.management.controller;

import com.example.student.management.dto.req.User_DTO_Req;
import com.example.student.management.dto.resp.User_DTO_Resp;
import com.example.student.management.enums.Role;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.exception.UserAlreadyExistsException;
import com.example.student.management.service.User_Service;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private User_Service userService;

    @GetMapping
    public String listUsers(@RequestParam(defaultValue = "0") int page, Model model) {
        Page<User_DTO_Resp> users = userService.getAll(PageRequest.of(page, 10));
        model.addAttribute("users", users);
        model.addAttribute("userReq", new User_DTO_Req());
        model.addAttribute("roles", Role.values());
        return "user";
    }

    @PostMapping("/create")
    public String createUser(@Valid @ModelAttribute("userReq") User_DTO_Req userReq,
                             BindingResult result,
                             @RequestParam(defaultValue = "0") int page,
                             Model model) {

        if (result.hasErrors()) {
            logger.warn("Lỗi validation khi tạo user: {}", result.getAllErrors());
        } else {
            try {
                userReq.setRole(Role.fromString(userReq.getRole().name()));
                userService.create(userReq);
                model.addAttribute("userReq", new User_DTO_Req()); // Reset form
            } catch (UserAlreadyExistsException ex) {
                result.rejectValue("userName", "error.userReq", ex.getMessage());
            } catch (IllegalArgumentException ex) {
                result.rejectValue("role", "error.userReq", "Vai trò không hợp lệ");
            }
        }

        Page<User_DTO_Resp> users = userService.getAll(PageRequest.of(page, 10));
        model.addAttribute("users", users);
        model.addAttribute("roles", Role.values());

        return "user";
    }

    @GetMapping("/delete/{userName}")
    public String deleteUser(@PathVariable String userName, Model model) {
        try {
            userService.delete(userName);
        } catch (NotFoundException ex) {
            model.addAttribute("error", ex.getMessage());
            Page<User_DTO_Resp> users = userService.getAll(PageRequest.of(0, 10));
            model.addAttribute("users", users);
            model.addAttribute("userReq", new User_DTO_Req());
            model.addAttribute("roles", Role.values());
            return "user";
        }
        return "redirect:/user";
    }
}