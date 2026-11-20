-- ============================================================
-- Event Decoration Planner - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS eventplanner;
USE eventplanner;

-- ============================================================
-- BOOKINGS TABLE (Pankaj's Module)
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id         BIGINT        NOT NULL,
    user_id          BIGINT        NOT NULL,
    total_cost       DOUBLE        NOT NULL,
    estimated_budget DOUBLE        NOT NULL,
    status           ENUM('PENDING', 'CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    booked_at        DATETIME      DEFAULT CURRENT_TIMESTAMP,
    notes            VARCHAR(500),

    -- Foreign Keys (linked to OM's and Nikhil's tables)
    CONSTRAINT fk_booking_event FOREIGN KEY (event_id)  REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_user  FOREIGN KEY (user_id)   REFERENCES users(id)  ON DELETE CASCADE
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================
INSERT INTO bookings (event_id, user_id, total_cost, estimated_budget, status, notes) VALUES
(1, 1, 15000.00, 20000.00, 'CONFIRMED', 'Birthday party decoration confirmed'),
(2, 2, 25000.00, 22000.00, 'PENDING',   'Wedding decoration - over budget, pending review'),
(3, 1, 8000.00,  10000.00, 'CANCELLED', 'Corporate event cancelled by client');
