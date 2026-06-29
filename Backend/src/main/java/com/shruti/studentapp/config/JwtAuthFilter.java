package com.shruti.studentapp.config;

import com.shruti.studentapp.service.jwtService;
import com.shruti.studentapp.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final jwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthFilter(jwtService jwtService,
                         CustomUserDetailsService customUserDetailsService) {
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("JWT FILTER EXECUTED");

        try {

            String authHeader = request.getHeader("Authorization");
            System.out.println("AUTH HEADER = " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);

            System.out.println("TOKEN = " + token);

            System.out.println("BEFORE EXTRACT");

            String username = jwtService.extractUsername(token);

            System.out.println("AFTER EXTRACT");

            System.out.println("TOKEN USERNAME = " + username);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(username);

                System.out.println("USER FOUND = " + userDetails.getUsername());
                System.out.println("AUTHORITIES = " + userDetails.getAuthorities());

                if (jwtService.validateToken(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("AUTHENTICATION SET");
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {
            System.out.println("TOKEN EXPIRED");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Token expired\"}");

        } catch (Exception ex) {
            System.out.println("JWT ERROR = " + ex.getClass().getName());
            System.out.println("MESSAGE = " + ex.getMessage());

            ex.printStackTrace();

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Invalid token\"}");
        }
    }
}