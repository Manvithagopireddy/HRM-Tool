package com.peoplecore.hrm.api.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Node for the N-ary tree representing the Organizational Chart.
 */
@Data
public class OrgChartNode {
    private String id;
    private String name;
    private String role;
    private String department;
    private String avatarInitials;
    private String avatarColor;
    
    // Computed using Depth First Search (DFS)
    private int totalSubordinates; 
    
    // Child nodes
    private List<OrgChartNode> directReports = new ArrayList<>();
}
