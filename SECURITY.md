# Security Policy

## Supported Versions
| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability
If you discover a security issue or vulnerability within AFTERLIGHT:
1. Please do not open a public issue.
2. Email security concerns privately to `security@afterlight.dev`.
3. Provide details including reproduction steps and environment context.
4. Vulnerability reports receive an initial response within 48 hours.

## Local Sandbox Protections
- **Path Traversal Defenses:** `zipfile` extraction blocks absolute paths and `..` directory traversal tokens.
- **Offline Archaeology:** Local repository files are parsed strictly in memory and local storage. No private repository code is forwarded to third-party endpoints without user configuration.
