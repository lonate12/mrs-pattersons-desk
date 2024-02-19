package com.hcc.utils;


import com.hcc.entities.User;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.function.Function;

@Component
public class JWTUtils {

    //how long is the token valid? a whole day
    public static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000; // 24h * 60min * 60sec * 1000ms

    // get the jwt secret from the properties file
    @Value("${jwt.secret}")
    private String secret;

    //get username from token
    public String getUsernameFromToken(String token){

        return getClaimFromToken(token, Claims::getSubject);
    }

    //get the claims (not sure which datatype- make generic to pass the claim) from token-objects inside jwt
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver ){

        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token){
        return Jwts.parser()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //check if token is expired
    public Date getExpirationDateFromToken(String token){
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public boolean isTokenExpired(String token){
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    //generate token
    public String generateToken(User user){
        return doGenerateToken(user.getUsername());

    }

    private String doGenerateToken(String subject){
        Claims claims = Jwts.claims().setSubject(subject).build();
        claims.put("scopes",
                Arrays.asList(new SimpleGrantedAuthority("LEARNER_ROLE"),
                new SimpleGrantedAuthority("CODE_REVIEWER_ROLE")));
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
