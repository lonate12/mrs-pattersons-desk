package com.hcc.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/reviewer")
public class ReviewerController {

    @GetMapping
    public String testHomeForReviewer() {
        return "You're at the reviewer route.";
    }
}
