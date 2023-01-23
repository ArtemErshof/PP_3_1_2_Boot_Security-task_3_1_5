package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

@RestController
@RequestMapping(value = "/adminPage")
public class UserRestController {
    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/userById/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok().body(userService.getById(id));
    }

    @PostMapping(value = "/createUser")
    public ResponseEntity<String> createUser(@ModelAttribute("user") User user) {
        userService.create(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/updateUser")
    public ResponseEntity<String> updateUser(@ModelAttribute("user") User user) {
        userService.update(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/deleteUser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") int id) {
        userService.delete(id);
        return ResponseEntity.ok().build();
    }
}
