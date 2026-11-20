package com.nikhil.event_decoration_planner.budget;

import com.nikhil.event_decoration_planner.booking.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BookingService bookingService;

    public BudgetController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/summary/{bookingId}")
    public ResponseEntity<BudgetSummary> getBudgetSummary(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBudgetSummary(bookingId));
    }

    @GetMapping("/calculate")
    public ResponseEntity<BudgetSummary> calculateBudget(
            @RequestParam Long eventId,
            @RequestParam Double estimatedBudget,
            @RequestParam Double totalDecorationCost) {
        return ResponseEntity.ok(BudgetSummary.calculate(eventId, estimatedBudget, totalDecorationCost));
    }
}
