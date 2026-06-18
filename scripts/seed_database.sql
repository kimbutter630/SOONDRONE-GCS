# Backend Database Seeding
-- 테스트 사용자 생성
INSERT INTO users (username, email, password_hash, role, status) VALUES
('admin', 'admin@soondrone.local', '$2b$10$KIX2NP9fzwHVkI6ZBcNB9OPYd4VXw.xYfBH8nKJ8.u1yYt2QaAqTO', 'admin', 'active'),
('pilot1', 'pilot1@soondrone.local', '$2b$10$KIX2NP9fzwHVkI6ZBcNB9OPYd4VXw.xYfBH8nKJ8.u1yYt2QaAqTO', 'operator', 'active'),
('pilot2', 'pilot2@soondrone.local', '$2b$10$KIX2NP9fzwHVkI6ZBcNB9OPYd4VXw.xYfBH8nKJ8.u1yYt2QaAqTO', 'operator', 'pending')
ON CONFLICT DO NOTHING;

-- 테스트 드론 생성
INSERT INTO drones (serial_number, model, manufacturer, owner_id, battery_capacity, max_flight_time, max_speed, max_altitude) VALUES
('DJI-M300-001', 'Matrice 300 RTK', 'DJI', 2, 5050, 1800, 20, 7000),
('DJI-M300-002', 'Matrice 300 RTK', 'DJI', 3, 5050, 1800, 20, 7000),
('FREEFLY-ALT-001', 'Astro Fully Automated', 'Freefly', 2, 7200, 2400, 18, 6000)
ON CONFLICT DO NOTHING;
