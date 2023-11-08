package dev.wizards.contractSystem.config.Security;


import dev.wizards.contractSystem.service.ServiceImpl.CustomUserDetailsService;
import dev.wizards.contractSystem.service.ServiceImpl.TokenBlacklistService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService customUserDetailsService, TokenBlacklistService tokenBlacklistService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if(!requiresAuthentication(request)){
            filterChain.doFilter(request, response);
            return;
        }
        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("Jwt: " + jwt);
            if (jwt != null && tokenProvider.validateToken(jwt) && !tokenBlacklistService.isBlacklisted(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                System.out.println("User detailsssss: " + userDetails);
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                System.out.println("Authentication: " + authentication);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

            else if(jwt != null){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or Missing token");
                return;
            }

        } catch (JwtException | IllegalArgumentException e ) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean requiresAuthentication(HttpServletRequest request) {
        List<RequestMatcher> permitAllMatchers = Arrays.asList(
                new AntPathRequestMatcher("/api/user/**", HttpMethod.POST.toString()),
                new AntPathRequestMatcher("/api/authenticate/**", HttpMethod.POST.toString()),
                new AntPathRequestMatcher("/api/exams/**"),
                new AntPathRequestMatcher("/api/modules/**", HttpMethod.GET.toString()),
                new AntPathRequestMatcher("/api/exam-logs/**", HttpMethod.POST.toString())
        );

        return permitAllMatchers.stream().noneMatch(matcher -> matcher.matches(request));
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            System.out.println("Token found in the header");
            return bearerToken.substring(7);
        }
        System.out.println("Token not found in the headerrrrrrrrrrrrrrrrrrr");
        return null;
    }
}
