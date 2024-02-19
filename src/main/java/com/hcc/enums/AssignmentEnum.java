package com.hcc.enums;

public enum AssignmentEnum {
    ASSIGNMENT_1(1, "Intro to Java"),
    ASSIGNMENT_2(2, "Intermediate Java"),
    ASSIGNMENT_3(3, "Advanced Java");

    private final int assignmentNumber;
    private final String assignmentName;

    AssignmentEnum(int assignmentNumber, String assignmentName) {
        this.assignmentNumber = assignmentNumber;
        this.assignmentName = assignmentName;
    }

    public int getAssignmentNumber() {
        return assignmentNumber;
    }

    public String getAssignmentName() {
        return assignmentName;
    }
}
