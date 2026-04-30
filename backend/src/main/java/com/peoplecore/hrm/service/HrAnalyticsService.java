package com.peoplecore.hrm.service;

import com.peoplecore.hrm.api.dto.LeaveCollision;
import com.peoplecore.hrm.api.dto.OrgChartNode;
import com.peoplecore.hrm.domain.model.Employee;
import com.peoplecore.hrm.domain.model.LeaveRequest;
import com.peoplecore.hrm.domain.repository.EmployeeRepository;
import com.peoplecore.hrm.domain.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

/**
 * HR Analytics Service demonstrating Data Structures and Algorithms (DSA).
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HrAnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRepository;

    /**
     * DSA Feature 1: Organizational Chart Generation using N-ary Tree and DFS.
     * 
     * Constructs a hierarchical tree of employees based on their manager.
     * Uses Depth First Search (DFS) to recursively calculate the total number of 
     * subordinates (both direct and indirect) for every employee in the tree.
     *
     * Time Complexity: O(N) where N is the number of employees.
     * Space Complexity: O(N) for the adjacency list (HashMap) and recursion stack.
     */
    public List<OrgChartNode> generateOrgChart() {
        List<Employee> allEmployees = employeeRepository.findAll();
        
        // 1. Map to hold Node references for O(1) access
        Map<String, OrgChartNode> nodeMap = new HashMap<>();
        
        // 2. Map to represent the Adjacency List: ManagerName -> List of Direct Reports
        Map<String, List<OrgChartNode>> adjacencyList = new HashMap<>();
        
        // Initialize nodes
        for (Employee emp : allEmployees) {
            OrgChartNode node = new OrgChartNode();
            node.setId(emp.getId());
            node.setName(emp.getFullName());
            node.setRole(emp.getRole());
            node.setDepartment(emp.getDepartment().getName());
            node.setAvatarInitials(emp.getAvatarInitials());
            node.setAvatarColor(emp.getAvatarColor());
            nodeMap.put(emp.getFullName(), node);
        }
        
        // Build the Adjacency List
        List<OrgChartNode> roots = new ArrayList<>();
        
        for (Employee emp : allEmployees) {
            OrgChartNode node = nodeMap.get(emp.getFullName());
            String managerName = emp.getManagerName();
            
            // If the employee has no manager or the manager is "CEO", they are a root node
            if (managerName == null || managerName.equalsIgnoreCase("CEO") || !nodeMap.containsKey(managerName)) {
                roots.add(node);
            } else {
                adjacencyList.computeIfAbsent(managerName, k -> new ArrayList<>()).add(node);
            }
        }
        
        // 3. DFS to assemble the tree and compute total subordinates
        for (OrgChartNode root : roots) {
            computeSubordinatesDFS(root, adjacencyList);
        }
        
        return roots;
    }

    /**
     * Helper recursive DFS method for the Org Chart.
     */
    private int computeSubordinatesDFS(OrgChartNode current, Map<String, List<OrgChartNode>> adjacencyList) {
        List<OrgChartNode> children = adjacencyList.getOrDefault(current.getName(), new ArrayList<>());
        current.setDirectReports(children);
        
        int totalSubordinates = children.size();
        
        for (OrgChartNode child : children) {
            totalSubordinates += computeSubordinatesDFS(child, adjacencyList);
        }
        
        current.setTotalSubordinates(totalSubordinates);
        return totalSubordinates;
    }

    /**
     * DSA Feature 2: Leave Collision Detection using the Sweep Line Algorithm.
     * 
     * Identifies periods where the number of employees concurrently on leave 
     * exceeds a given threshold. This helps HR spot potential staffing bottlenecks.
     *
     * Algorithm: Sweep Line (Event Sorting)
     * Time Complexity: O(L log L) where L is the number of approved leave requests.
     * Space Complexity: O(L) to store the events.
     */
    public List<LeaveCollision> findLeaveCollisions(int threshold) {
        List<LeaveRequest> approvedLeaves = leaveRepository.findByStatus(LeaveRequest.LeaveStatus.APPROVED);
        
        // 1. Create events: +1 for start date, -1 for the day AFTER end date
        List<LeaveEvent> events = new ArrayList<>();
        for (LeaveRequest leave : approvedLeaves) {
            events.add(new LeaveEvent(leave.getFromDate(), 1));
            events.add(new LeaveEvent(leave.getToDate().plusDays(1), -1));
        }
        
        // 2. Sort events primarily by date. 
        // If dates are equal, process end events (-1) before start events (+1)
        events.sort((a, b) -> {
            int dateCompare = a.date.compareTo(b.date);
            if (dateCompare != 0) return dateCompare;
            return Integer.compare(a.delta, b.delta);
        });
        
        // 3. Sweep the line to find overlapping intervals
        List<LeaveCollision> collisions = new ArrayList<>();
        int concurrentCount = 0;
        LocalDate collisionStart = null;
        
        for (LeaveEvent event : events) {
            concurrentCount += event.delta;
            
            if (concurrentCount >= threshold && collisionStart == null) {
                // Threshold crossed, start recording collision
                collisionStart = event.date;
            } else if (concurrentCount < threshold && collisionStart != null) {
                // Threshold dropped below, close the collision period
                // We subtract 1 day because the -1 event happens on the day AFTER the leave ends
                collisions.add(new LeaveCollision(collisionStart, event.date.minusDays(1), concurrentCount + 1));
                collisionStart = null;
            }
        }
        
        return collisions;
    }

    /** Helper class for the Sweep Line algorithm. */
    private static class LeaveEvent {
        LocalDate date;
        int delta;

        public LeaveEvent(LocalDate date, int delta) {
            this.date = date;
            this.delta = delta;
        }
    }
}
