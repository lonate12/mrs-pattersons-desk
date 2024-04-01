package com.hcc.dto;

import com.hcc.enums.AssignmentStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAssignmentRequestDTO {
    private String githubUrl;
    private String branch;
    private String status;
    private String reviewVideoUrl;

    @Override
    public String toString() {
        return "UpdateAssignmentRequestDTO{" +
                "githubUrl='" + githubUrl + '\'' +
                ", branch='" + branch + '\'' +
                ", status='" + status + '\'' +
                ", reviewVideoUrl='" + reviewVideoUrl + '\'' +
                '}';
    }
}
