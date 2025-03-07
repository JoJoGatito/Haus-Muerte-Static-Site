# LimeSurvey Development Guide

## Build & Development Commands
- **Docker Build**: `docker build -t limesurvey-fly .`
- **Docker Run**: `docker run -p 8080:8080 limesurvey-fly`
- **Deploy to Fly.io**: `fly deploy`

## Code Style Guidelines
- Use **CamelCase** for class names, method names, properties, parameters, and variables
- Method length should not exceed 150 lines
- Variable naming:
  - Minimum length: 3 characters (except 'db')
  - Maximum length: 40 characters
- Method naming: Minimum length 3 characters (except 'gt', 'et')
- Use type declarations where possible
- Avoid superglobals where possible
- Check for unused code (fields, variables, methods, parameters)

## Pull Request Workflow
- Bug fixes go to **master** branch
- New features go to **develop** branch
- Always reference Mantis issue numbers in PR descriptions
- PR title format: "Fixed issue #XXXX:" or "New feature #XXXX:" or "Dev:"

## Error Handling
- Avoid exit expressions
- Avoid eval expressions
- Validate user inputs thoroughly
- Don't use development code fragments in production