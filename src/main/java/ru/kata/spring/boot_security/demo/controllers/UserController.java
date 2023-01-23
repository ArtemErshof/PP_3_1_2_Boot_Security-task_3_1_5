package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;

@Controller
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/user")
    public String getHome(@AuthenticationPrincipal User activeUser, Model model) {
        model.addAttribute("activeUser", activeUser);
        model.addAttribute("roles", activeUser.getRoleSet());
        return "home_page";
    }

    @GetMapping(value = "/admin")
    public String getAllUsers(@AuthenticationPrincipal User activeUser, Model model, @ModelAttribute("user") User user) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        model.addAttribute("activeUser", activeUser);
        model.addAttribute("roles", activeUser.getRoleSet());
        return "admin";
    }
}
