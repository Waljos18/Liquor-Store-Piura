package com.licoreria.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProperties {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:3600000}")
    private long expiration;

    @Value("${jwt.refresh-expiration:86400000}")
    private long refreshExpiration;

    public String getSecret() { return secret; }
    public long getExpiration() { return expiration; }
    public long getRefreshExpiration() { return refreshExpiration; }
}
