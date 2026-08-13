package com.student.management.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket(String ip, boolean isLogin) {
        if (isLogin) {
            Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
            return Bucket.builder().addLimit(limit).build();
        } else {
            Bandwidth limit = Bandwidth.classic(60, Refill.intervally(60, Duration.ofMinutes(1)));
            return Bucket.builder().addLimit(limit).build();
        }
    }

    private Bucket resolveBucket(String ip, boolean isLogin) {
        String key = ip + (isLogin ? "_login" : "_api");
        return cache.computeIfAbsent(key, k -> createNewBucket(ip, isLogin));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            
        String path = request.getRequestURI();
        
        if (path.startsWith("/api/")) {
            String ip = request.getRemoteAddr();
            boolean isLogin = path.equals("/api/v1/auth/login");
            
            Bucket bucket = resolveBucket(ip, isLogin);
            
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"success\": false, \"message\": \"Rate limit exceeded. Please try again later.\"}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
