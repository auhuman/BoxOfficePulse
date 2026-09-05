-- =====================================================================
-- BoxOffice Pulse - Production ClickHouse DDL Schema
-- Optimized for High-Throughput Cinema Telemetry & Real-Time P99 Analytics
-- =====================================================================

-- 1. Base Theaters Metadata Table
CREATE TABLE IF NOT EXISTS theaters (
    theater_id LowCardinality(String),
    name String,
    chain LowCardinality(String),
    dma LowCardinality(String),
    city String,
    state LowCardinality(String),
    zip_code LowCardinality(String),
    lat Float64,
    lng Float64,
    total_screens UInt8,
    total_seats UInt16,
    created_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree()
ORDER BY (dma, theater_id);

-- 2. Movies Catalog
CREATE TABLE IF NOT EXISTS movies (
    movie_id LowCardinality(String),
    title String,
    genre LowCardinality(String),
    runtime_mins UInt16,
    distributor LowCardinality(String),
    target_demographic LowCardinality(String),
    national_budget UInt32,
    release_date Date,
    created_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree()
ORDER BY (movie_id);

-- 3. High-Velocity Ticket Sales Telemetry Stream (Millions of events/hour)
CREATE TABLE IF NOT EXISTS ticket_sales_stream (
    event_id UUID,
    event_time DateTime64(3, 'UTC'),
    theater_id LowCardinality(String),
    theater_name String,
    dma LowCardinality(String),
    screen_number UInt8,
    movie_id LowCardinality(String),
    movie_title String,
    ticket_count UInt16,
    revenue Float32,
    seat_tier LowCardinality(String),
    age_group LowCardinality(String),
    fill_rate_pct Float32
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(event_time)
ORDER BY (dma, theater_id, movie_id, event_time)
TTL event_time + INTERVAL 30 DAY;

-- 4. Screen Allocations & DCP Key Delivery Messages (KDM)
CREATE TABLE IF NOT EXISTS dcp_screen_allocations (
    theater_id LowCardinality(String),
    screen_number UInt8,
    screen_name String,
    format LowCardinality(String),
    capacity UInt16,
    movie_id LowCardinality(String),
    movie_title String,
    current_fill_rate_pct Float32,
    tickets_sold_today UInt32,
    revenue_today Float32,
    dcp_license_key String,
    kdm_expires_at DateTime,
    status LowCardinality(String),
    updated_at DateTime DEFAULT now()
) ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (theater_id, screen_number);

-- 5. Autonomous Studio Agent Actions Audit Log
CREATE TABLE IF NOT EXISTS agent_actions_audit (
    action_id UUID,
    action_time DateTime DEFAULT now(),
    action_type LowCardinality(String),
    theater_id LowCardinality(String),
    dma LowCardinality(String),
    movie_surging LowCardinality(String),
    movie_replaced LowCardinality(String),
    screen_number UInt8,
    revenue_delta_estimate Float32,
    details String,
    executed_by LowCardinality(String) DEFAULT 'Gemini-Autonomous-Supervisor'
) ENGINE = MergeTree()
ORDER BY (action_time, action_type);

-- 6. Real-Time Materialized View: Hourly P95 & P99 Quantile Fill Rates by DMA
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dma_fill_rate_quantiles
ENGINE = SummingMergeTree()
PRIMARY KEY (dma, movie_id, window_hour)
AS SELECT
    dma,
    movie_id,
    toStartOfHour(event_time) AS window_hour,
    count() AS total_transactions,
    sum(ticket_count) AS total_tickets,
    sum(revenue) AS total_gross_revenue,
    quantilesExactWeighted(0.50, 0.90, 0.95, 0.99)(fill_rate_pct, ticket_count) AS fill_rate_quantiles
FROM ticket_sales_stream
GROUP BY dma, movie_id, window_hour;

-- 7. Real-Time Surge Detection Query (Called by Agent MCP tool)
-- SELECT
--     theater_id,
--     theater_name,
--     dma,
--     movie_id,
--     movie_title,
--     avg(fill_rate_pct) AS avg_fill,
--     quantileExact(0.99)(fill_rate_pct) AS p99_fill,
--     sum(revenue) AS recent_revenue,
--     count() AS sales_velocity
-- FROM ticket_sales_stream
-- WHERE event_time >= now() - INTERVAL 15 MINUTE
-- GROUP BY theater_id, theater_name, dma, movie_id, movie_title
-- HAVING p99_fill >= 90.0 AND sales_velocity >= 5
-- ORDER BY p99_fill DESC, recent_revenue DESC;
