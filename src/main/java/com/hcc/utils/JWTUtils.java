package com.hcc.utils;


import com.hcc.entities.Authority;
import com.hcc.entities.User;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.*;
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

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver ){

        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // NOTE: Changes this from private to public to test something out, make sure to go back and make it private again
    public Claims getAllClaimsFromToken(String token){
        return Jwts.parser()
                .setSigningKey(secret)
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
    public String generateToken(Authentication auth){
        return doGenerateToken(auth);
    }

    private String doGenerateToken(Authentication auth){
        Claims claims = Jwts.claims().setSubject(auth.getName());
        claims.put("scopes", auth.getAuthorities());
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public Collection<? extends GrantedAuthority> getAuthoritiesFromToken(String token) {
        List<GrantedAuthority> authorityList = new ArrayList<>();

        List<HashMap<String, String>> scopes = getAllClaimsFromToken(token).get("scopes", ArrayList.class);

        for (Map<String, String> scope : scopes) {
            for (Map.Entry<String, String> entry : scope.entrySet()) {
               authorityList.add(new SimpleGrantedAuthority(entry.getValue()));
            }
        }

        return authorityList;
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
