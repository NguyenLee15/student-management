package com.example.student.management.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @GetMapping("/home")
    public String showHomePage(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = null;

        logger.debug("SecurityContext in HomeController: {}", authentication);
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getPrincipal().equals("anonymousUser")) {
            username = authentication.getName();
            logger.info("Accessing /home for user: {}", username);
        } else {
            logger.warn("No authenticated user, redirecting to /login");
            return "redirect:/login";
        }

        model.addAttribute("username", username);
        return "home";
    }
}