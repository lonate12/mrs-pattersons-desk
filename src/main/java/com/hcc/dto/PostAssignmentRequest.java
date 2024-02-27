package com.hcc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostAssignmentRequest {
    private String githubUrl;
    private String branch;
    private Integer assignmentNumber;
}
