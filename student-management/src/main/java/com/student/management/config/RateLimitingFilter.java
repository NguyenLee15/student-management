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

    private Bucket createNewBucket(String ip, boolean isAuth) {
        if (isAuth) {
            // Auth endpoints: 10 requests / 1 minute
            Bandwidth limit = Bandwidth.classic(10, Refill.intervally(10, Duration.ofMinutes(1)));
            return Bucket.builder().addLimit(limit).build();
        } else {
            // General APIs: 120 requests / 1 minute
            Bandwidth limit = Bandwidth.classic(120, Refill.intervally(120, Duration.ofMinutes(1)));
            return Bucket.builder().addLimit(limit).build();
        }
    }

    private Bucket resolveBucket(String ip, boolean isAuth) {
        String key = ip + (isAuth ? "_auth" : "_api");
        return cache.computeIfAbsent(key, k -> createNewBucket(ip, isAuth));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            
        String path = request.getRequestURI();
        
        if (path.startsWith("/api/")) {
            String ip = request.getRemoteAddr();
            boolean isAuth = path.startsWith("/api/v1/auth/");
            
            Bucket bucket = resolveBucket(ip, isAuth);
            
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"status\":429,\"message\":\"Quá nhiều yêu cầu (Rate limit exceeded). Vui lòng thử lại sau ít phút.\",\"data\":null}");
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
