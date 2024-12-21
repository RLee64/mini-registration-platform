package com.nzpmc.backend.services;

import com.nzpmc.backend.dtos.JWTDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {
    private static final Logger log = LoggerFactory.getLogger(JWTService.class);
    private String jwtSecret = "3bc8295fcfc9a4390cd2c890092abd43e8fe6a07b82d22ef142a7f7e7da4f6041f5330bf566e88a31012361a8ebf11826a501eeee98c7be615bfbdba49b2df14c852774a8606f1854c7978ea2c5d4d3da200fb25391e1d4c724c7bd5e4fc290e42857513945d46983ee3654ad9fcc09eec174a231641068f0b7b193701c2c82e0429274d4146a50189968c4cd9d4af786e89981dbca9916a5b892d08f4ce5fcd34785efc626217c0d52640cba7e1e369ee2e799ce352522a64a631956ed354153228ea5eeb895b5c03dd9f714fa527c6c4d351fec37209fbcd42068613ae503145933eb17087a2a7f5a499a56a75a68e2879f0237de1b5d1c6971ea743a7802f";

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createToken(JWTDetails JWTDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("accessLevel", JWTDetails.accessLevel());

        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(JWTDetails.email())
                .signWith(getSignInKey())
                .compact();
    }

    public JWTDetails validateToken(String authorizationHeader) {
        String accessToken = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;

        try {
            Claims claims = Jwts
                    .parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload();

            return new JWTDetails(claims.getSubject(), claims.get("accessLevel").toString());
        } catch (Exception e) {
            log.error("Error: ", e);
            return null;
        }
    }
}
