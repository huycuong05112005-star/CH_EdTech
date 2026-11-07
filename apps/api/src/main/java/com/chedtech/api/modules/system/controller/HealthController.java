package com.chedtech.api.modules.system.controller;

import com.chedtech.api.common.response.ApiResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListBucketsResponse;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;
    private final S3Client s3Client;

    public HealthController(JdbcTemplate jdbcTemplate, S3Client s3Client) {
        this.jdbcTemplate = jdbcTemplate;
        this.s3Client = s3Client;
    }

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> getSystemHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", Instant.now());
        status.put("service", "ch-edtech-api");
        status.put("version", "0.1.0-SNAPSHOT");

        // 1. Verify PostgreSQL & pgvector
        Map<String, Object> dbHealth = new HashMap<>();
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            String pgvectorVersion = jdbcTemplate.queryForObject(
                "SELECT extversion FROM pg_extension WHERE extname = 'vector'", String.class);

            dbHealth.put("database", "PostgreSQL 16");
            dbHealth.put("connection", (result != null && result == 1) ? "CONNECTED" : "FAILED");
            dbHealth.put("pgvector_extension", pgvectorVersion != null ? pgvectorVersion : "NOT_INSTALLED");
            dbHealth.put("status", "HEALTHY");
        } catch (Exception e) {
            dbHealth.put("status", "DEGRADED");
            dbHealth.put("error", e.getMessage());
        }
        status.put("database", dbHealth);

        // 2. Verify Object Storage (MinIO / S3)
        Map<String, Object> storageHealth = new HashMap<>();
        try {
            ListBucketsResponse buckets = s3Client.listBuckets();
            storageHealth.put("status", "HEALTHY");
            storageHealth.put("provider", "MinIO (S3-compatible)");
            storageHealth.put("bucket_count", buckets.buckets().size());
        } catch (Exception e) {
            storageHealth.put("status", "DEGRADED");
            storageHealth.put("error", e.getMessage());
        }
        status.put("storage", storageHealth);

        // 3. JVM Telemetry
        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        Map<String, Object> jvmMetrics = new HashMap<>();
        jvmMetrics.put("heap_used_mb", memoryBean.getHeapMemoryUsage().getUsed() / (1024 * 1024));
        jvmMetrics.put("heap_max_mb", memoryBean.getHeapMemoryUsage().getMax() / (1024 * 1024));
        status.put("jvm", jvmMetrics);

        return ApiResponse.ok(status, "CH EdTech Platform Operational");
    }
}

