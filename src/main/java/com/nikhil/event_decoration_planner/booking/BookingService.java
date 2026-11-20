package com.nikhil.event_decoration_planner.booking;

import com.nikhil.event_decoration_planner.budget.BudgetSummary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public Booking confirmBooking(Long id) {
        Booking booking = getById(id);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getById(id);
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public BudgetSummary getBudgetSummary(Long bookingId) {
        Booking booking = getById(bookingId);
        return BudgetSummary.calculate(booking.getEventId(), booking.getEstimatedBudget(), booking.getTotalCost());
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
