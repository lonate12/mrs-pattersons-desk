package com.hcc.services;

import com.hcc.dto.PostAssignmentRequest;
import com.hcc.dto.UpdateAssignmentRequestDTO;
import com.hcc.entities.Assignment;
import com.hcc.entities.User;
import com.hcc.enums.AssignmentStatusEnum;
import com.hcc.enums.AuthorityEnum;
import com.hcc.exceptions.AssignmentNotFoundException;
import com.hcc.exceptions.AssignmentUpdateException;
import com.hcc.exceptions.InsufficientPermissionsException;
import com.hcc.repositories.AssignmentRepository;
import com.hcc.utils.DtoConverter;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class AssignmentService {

    private AssignmentRepository assignmentRepository;

    @Transactional
    public List<Assignment> getAllAssignments(Authentication auth) {
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        User user = (User) auth.getPrincipal();

        if (authorities.contains(new SimpleGrantedAuthority(AuthorityEnum.ROLE_CODE_REVIEWER.toString()))) {

            List<Assignment> codeReviewerOwnedAssignments = assignmentRepository.findByCodeReviewerId(user.getId());
            List<Assignment> submittedAssignments = assignmentRepository.findByStatus("SUBMITTED");
            List<Assignment> resubmittedAssignments = assignmentRepository.findByStatus("RESUBMITTED");

            return Stream.of(codeReviewerOwnedAssignments, submittedAssignments, resubmittedAssignments).flatMap(Collection::stream).collect(Collectors.toList());
        } else {
            return assignmentRepository.findByUserId(user.getId());
        }
    }

    public Assignment updateById(Long assignmentId, UpdateAssignmentRequestDTO updatedAssignment) {
        // Getting the auth object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Checking if the currently requesting user has reviewer status
        boolean isReviewer = auth.getAuthorities().contains(new SimpleGrantedAuthority(AuthorityEnum.ROLE_CODE_REVIEWER.toString()));

        // Requesting user
        User requestingUser = (User) auth.getPrincipal();

        // Load the existing assignment
        Assignment existingAssignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentNotFoundException("Could not find assignment with assignment ID " + assignmentId));

        // If the assignment is already in a COMPLETED state, it should not be updated by anyone
        if (existingAssignment.getStatus().equals(AssignmentStatusEnum.COMPLETED.toString())) {
            throw new AssignmentUpdateException("Completed assignments cannot be updated.");
        }

        // If the user is not a reviewer and doesn't own the assignment, we should now allow them to update the assignment
        if (!requestingUser.getId().equals(existingAssignment.getUser().getId()) && !isReviewer) {
            throw new AssignmentUpdateException("You don't have permissions to update this assignment.");
        }

        // Merge the loaded assignment
        Assignment mergedAssignment = new Assignment();
        Assignment savedAssignment = new Assignment();

        try {
            mergedAssignment = DtoConverter.mergeUpdateAssignmentRequest(
                    existingAssignment,
                    updatedAssignment,
                    requestingUser,
                    isReviewer
            );

            savedAssignment = assignmentRepository.save(mergedAssignment);
        } catch (Error e) {
            System.out.println(e.toString());
        }


        return savedAssignment;
    }

    public Assignment getAssignmentById(Long assignmentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(() -> new AssignmentNotFoundException("Assignment not found."));

        if (!auth.getAuthorities().contains(new SimpleGrantedAuthority(AuthorityEnum.ROLE_CODE_REVIEWER.toString()))
                && !assignment.getUser().getUsername().equals(auth.getName())) {
            throw new InsufficientPermissionsException("You don't have permissions to access this assignment");
        }

        return assignment;
    }

    public Assignment postAssignment(PostAssignmentRequest request) {
        return assignmentRepository.save(
                new Assignment(
                        AssignmentStatusEnum.SUBMITTED.toString(),
                        request.getAssignmentNumber(),
                        request.getGithubUrl(),
                        request.getBranch(),
                        null,
                        (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal(),
                        null
                )
        );
    }

    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentNotFoundException("Assignment not found."));

        assignmentRepository.deleteById(assignmentId);
    }
}
