# Setting HttpOnly operator_token cookie (short snippets)

This file contains short server-side snippets to set `operator_token` as an HttpOnly cookie. Use `Secure` and `HttpOnly` in production (serve over HTTPS).

## Node / Express

```js
// After successful authentication (e.g., you issued a JWT called `token`):
res.cookie("operator_token", token, {
  httpOnly: true,
  secure: true, // set true in production (HTTPS)
  sameSite: "Strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
  path: "/",
});

// Return any non-sensitive user info in JSON body
res.json({ id: user.id, username: user.username, role: "OPERATOR" });
```

Notes:

- If using CORS and your frontend is on a different origin, enable credentials and specify origin:

```js
app.use(cors({ origin: "https://your-frontend.example", credentials: true }));
```

- Client-side fetch must use `credentials: 'include'`.

---

## Spring Boot (Java)

```java
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

// After generating `token`:
ResponseCookie cookie = ResponseCookie.from("operator_token", token)
    .httpOnly(true)
    .secure(true)              // true in production
    .path("/")
    .maxAge(Duration.ofDays(1))
    .sameSite("Strict")
    .build();

return ResponseEntity.ok()
    .header(HttpHeaders.SET_COOKIE, cookie.toString())
    .body(Map.of("id", user.getId(), "username", user.getUsername(), "role", "OPERATOR"));
```

Notes:

- If using Spring Security, prefer reading cookie server-side and validating token there on each request.
- Configure CORS to allow credentials and specific origin (no wildcard `*`).

---

## Security recommendations

- Always set `Secure` and `HttpOnly` for authentication cookies in production.
- Prefer server-set HttpOnly cookie over storing tokens in localStorage to reduce XSS risk.
- Use `SameSite=Strict` (or `Lax` if cross-site POST is needed) and `Secure`.
- Ensure server parses cookie and validates the JWT on protected endpoints.

If you want, I can add a sample server endpoint in your project's backend repo (if you share it) and demonstrate the full flow (CORS, credentials, logout cookie deletion).
