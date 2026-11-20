package com.nikhil.event_decoration_planner.budget;

public class BudgetSummary {

    private Long eventId;
    private Double estimatedBudget;
    private Double totalDecorationCost;
    private Double remainingBudget;
    private boolean withinBudget;

    public BudgetSummary(Long eventId, Double estimatedBudget, Double totalDecorationCost, double remainingBudget, boolean withinBudget) {
        this.eventId = eventId;
        this.estimatedBudget = estimatedBudget;
        this.totalDecorationCost = totalDecorationCost;
        this.remainingBudget = remainingBudget;
        this.withinBudget = withinBudget;
    }

    public static BudgetSummary calculate(Long eventId, Double estimatedBudget, Double totalDecorationCost) {
        double remaining = estimatedBudget - totalDecorationCost;
        return new BudgetSummary(eventId, estimatedBudget, totalDecorationCost, remaining, remaining >= 0);
    }

    public Long getEventId() { return eventId; }
    public Double getEstimatedBudget() { return estimatedBudget; }
    public Double getTotalDecorationCost() { return totalDecorationCost; }
    public Double getRemainingBudget() { return remainingBudget; }
    public boolean isWithinBudget() { return withinBudget; }
}
