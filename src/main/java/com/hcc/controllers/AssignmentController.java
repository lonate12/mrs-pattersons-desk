package com.hcc.controllers;

import com.hcc.dto.PostAssignmentRequest;
import com.hcc.dto.UpdateAssignmentRequestDTO;
import com.hcc.entities.Assignment;
import com.hcc.entities.User;
import com.hcc.repositories.AssignmentRepository;
import com.hcc.services.AssignmentService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/assignments")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AssignmentController {

    private AssignmentService assignmentService;
    private final AssignmentRepository assignmentRepository;

    @GetMapping
    public List<Assignment> getAllAssignments(Authentication authentication) {
        return assignmentService.getAllAssignments(authentication);
    }

    @RequestMapping(path = "/{assignmentId}", method = RequestMethod.GET)
    public Assignment getAssignmentById(@PathVariable Long assignmentId) {
        return assignmentService.getAssignmentById(assignmentId);
    }

    @RequestMapping(path = "/{assignmentId}", method = RequestMethod.PUT)
    public Assignment updateAssignmentById(@PathVariable Long assignmentId, @RequestBody UpdateAssignmentRequestDTO request) {
        return assignmentService.updateById(assignmentId, request);
    }

    @PostMapping
    public Assignment postAssignment(@RequestBody PostAssignmentRequest request) {
        return assignmentService.postAssignment(request);
    }

    @DeleteMapping(path="/{assignmentId}")
    public boolean deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return true;
    }
}
