# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to security@tarsify.com. All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the issue until it has been addressed by the team.

## Security Measures

This project implements the following security measures:

### Authentication
- Firebase Authentication for user management
- JWT tokens with automatic refresh
- Secure session handling

### API Security
- All API requests require authentication
- CORS configuration for allowed origins
- Rate limiting on API endpoints

### Code Security
- Automated dependency vulnerability scanning (Dependabot)
- Secret scanning with TruffleHog
- No secrets in code (uses environment variables and GCP Secret Manager)

### Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrictive

### CI/CD Security
- All PRs require passing security checks
- Automated npm audit on every build
- Dependency review for new packages
