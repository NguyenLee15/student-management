// cSpell:disable
package com.student.management.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_CACHE_SIZE = 10_000;
    private final Cache<String, Bucket> cache = Caffeine.newBuilder()
            .maximumSize(MAX_CACHE_SIZE)
            .expireAfterAccess(Duration.ofMinutes(10))
            .build();

    private Bucket createNewBucket(String ip, String bucketType) {
        if ("webhook".equals(bucketType)) {
            // Webhook endpoints: 60 requests / 1 minute (prevents HMAC verification CPU exhaustion while ensuring delivery)
            Bandwidth limit = Bandwidth.builder().capacity(60).refillIntervally(60, Duration.ofMinutes(1)).build();
            return Bucket.builder().addLimit(limit).build();
        } else if ("auth".equals(bucketType)) {
            // Auth endpoints: 10 requests / 1 minute
            Bandwidth limit = Bandwidth.builder().capacity(10).refillIntervally(10, Duration.ofMinutes(1)).build();
            return Bucket.builder().addLimit(limit).build();
        } else {
            // General APIs: 120 requests / 1 minute
            Bandwidth limit = Bandwidth.builder().capacity(120).refillIntervally(120, Duration.ofMinutes(1)).build();
            return Bucket.builder().addLimit(limit).build();
        }
    }

    private Bucket resolveBucket(String ip, String bucketType) {
        String key = ip + "_" + bucketType;
        return cache.get(key, k -> createNewBucket(ip, bucketType));
    }

    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request, @org.springframework.lang.NonNull HttpServletResponse response, @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {
            
        String path = request.getRequestURI();

        if (path.startsWith("/api/")) {
            String ip = request.getRemoteAddr();
            String bucketType = "general";
            if ("/api/v1/payments/payos-webhook".equals(path)) {
                bucketType = "webhook";
            } else if (path.startsWith("/api/v1/auth/") || path.contains("/payments/create-checkout")) {
                bucketType = "auth";
            }
            
            Bucket bucket = resolveBucket(ip, bucketType);
            
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\":false,\"status\":429,\"code\":\"RATE_LIMIT_EXCEEDED\",\"message\":\"Quá nhiều yêu cầu (Rate limit exceeded). Vui lòng thử lại sau ít phút.\",\"data\":null}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
