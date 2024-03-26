package com.hcc.utils;

import com.hcc.dto.UpdateAssignmentRequestDTO;
import com.hcc.entities.Assignment;
import com.hcc.entities.User;
import com.hcc.enums.AssignmentStatusEnum;
import com.hcc.exceptions.InsufficientPermissionsException;
import com.hcc.exceptions.InvalidStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DtoConverter {
    public static Assignment mergeUpdateAssignmentRequest(Assignment assignment,
                                                 UpdateAssignmentRequestDTO request,
                                                 User requestingUser,
                                                 boolean isReviewer) {
        // Fields id, number, user cannot be changed, so we'll ignore those even if then exist on the request
        System.out.println("Incoming merge request...");

        // Start with the status. What we do is dependent on whether the requester is a reviewer and the actual status
        // change request
        if (request.getStatus() != null) {
            // List of status changes requiring reviewer permissions
            List<String> reviewerList = new ArrayList<>(Arrays.asList("UNDER_REVIEW", "REJECTED", "COMPLETED"));

            // If request.getStatus() is in the reviewer list, we need to check that they're a reviewer
            if (reviewerList.contains(request.getStatus())) {
                // In this block, we first have to make sure the requester is a reviewer, if not, we'll throw an exception
                if (!isReviewer) {
                    throw new InsufficientPermissionsException("Insufficient permissions to update assignment as requested");
                }
                assignment.setCodeReviewer(requestingUser);
            }

            // Check if the request.getStatus() is a valid string
            boolean isValidStatus = false;

            for (AssignmentStatusEnum status : AssignmentStatusEnum.values()) {
                if (status.toString().equals(request.getStatus())) {
                    isValidStatus = true;
                }
            }

            if (!isValidStatus) {
                throw new InvalidStatusException("Updated status is invalid.");
            }


            assignment.setStatus(request.getStatus());
        }

        // Update Github URL
        if (request.getGithubUrl() != null) {
            assignment.setGithubUrl(request.getGithubUrl());
        }

        // Update branch
        if (request.getBranch() != null) {
            assignment.setBranch(request.getBranch());
        }

        // Update reviewVideoUrl
        if (request.getReviewVideoUrl() != null) {
            if (!isReviewer) {
                throw new InsufficientPermissionsException("Insufficient permissions to update assignment");
            }
            assignment.setReviewVideoUrl(request.getReviewVideoUrl());
        }

        return assignment;
    }
}
