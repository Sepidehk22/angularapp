# Angular MSAL POC

## Overview

This project is a **Proof of Concept (POC)** built with **Angular 16** to demonstrate authentication with **Microsoft Authentication Library (MSAL)** and deployment through **Azure Static Web Apps**.

The project also explores how environment-dependent settings can be managed through **dynamic configuration**, reducing the need to hardcode configuration directly into the Angular application.

The main areas covered by the POC are:

* Angular frontend development;
* authentication with MSAL;
* Microsoft Entra ID integration;
* Azure Static Web Apps deployment;
* runtime configuration;
* separation between application code and environment-specific settings.

---

## Technology Stack

The project uses:

* **Angular 16.2.15**
* **TypeScript**
* **MSAL**
* **Microsoft Entra ID**
* **Azure Static Web Apps**
* **Node.js / npm**

The project was originally generated with Angular CLI version `16.2.15`.

---

## Authentication with MSAL

The application uses **Microsoft Authentication Library (MSAL)** to integrate Angular authentication with Microsoft Entra ID.

At a high level, the authentication flow is:

```text
User
  │
  ▼
Angular Application
  │
  ▼
MSAL
  │
  ▼
Microsoft Entra ID
  │
  ▼
Authentication
  │
  ▼
Access / ID Token
  │
  ▼
Angular Application
```

MSAL manages the interaction between the Angular application and Microsoft Entra ID, including authentication requests and token handling.

Depending on the application configuration, authenticated users can then access protected areas of the frontend or use access tokens when communicating with protected APIs.

---

## Dynamic Configuration

One of the objectives of this POC is to avoid tightly coupling environment-specific configuration to the Angular build.

A traditional Angular application often uses files such as:

```text
environment.ts
environment.development.ts
environment.production.ts
```

These values are generally selected or replaced during the build process.

This means that configuration is effectively included in the generated frontend bundle.

For deployments across several environments, this can lead to a pattern such as:

```text
Development configuration
        ↓
Development build

Test configuration
        ↓
Test build

Production configuration
        ↓
Production build
```

The dynamic configuration approach separates these concerns.

```text
Angular Build
      │
      ▼
Azure Static Web Apps
      │
      ▼
Load Runtime Configuration
      │
      ▼
Initialize Application
      │
      ▼
Initialize MSAL
```

The application can therefore obtain selected environment-dependent values when it starts rather than relying exclusively on compile-time configuration.

---

## Example Runtime Configuration

A configuration object could contain values such as:

```json
{
  "environment": "production",
  "clientId": "<ENTRA-APPLICATION-CLIENT-ID>",
  "authority": "https://login.microsoftonline.com/<TENANT-ID>",
  "redirectUri": "https://example.azurestaticapps.net",
  "apiBaseUrl": "https://api.example.com"
}
```

The Angular application loads the configuration before initializing services that depend on it, including MSAL.

This is particularly useful for values such as:

* Microsoft Entra application/client ID;
* tenant or authority information;
* redirect URI;
* API base URL;
* environment name;
* public feature flags.

> **Security note:** Configuration delivered to an Angular application is visible to the browser and must not contain secrets. Client secrets, passwords, private API keys, credentials, and other sensitive values must remain server-side.

---

## Application Startup

With runtime configuration, application initialization can conceptually follow this sequence:

```text
index.html
    │
    ▼
Angular Bootstrap
    │
    ▼
Load Configuration
    │
    ▼
Validate Configuration
    │
    ▼
Configure MSAL
    │
    ▼
Start Application
```

This ensures that MSAL receives the correct configuration before authentication-related components and services begin using it.

---

## Azure Static Web Apps

The Angular application can be hosted using **Azure Static Web Apps**.

A typical deployment flow is:

```text
GitHub Repository
       │
       ▼
GitHub Actions
       │
       ▼
Angular Build
       │
       ▼
Azure Static Web Apps
       │
       ▼
Angular Application
```

Changes pushed to the configured repository branch can trigger a workflow that builds and deploys the application automatically.

---

## Project Structure

A simplified project structure may look like:

```text
angular-msal-poc/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── assets/
│   │   └── config/
│   │
│   ├── environments/
│   ├── index.html
│   └── main.ts
│
├── staticwebapp.config.json
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

The exact structure can differ depending on how runtime configuration and MSAL have been implemented in the POC.

---

## Prerequisites

Before running the project locally, install:

* Node.js
* npm
* Angular CLI

Install Angular CLI if necessary:

```bash
npm install -g @angular/cli
```

Install the project dependencies:

```bash
npm install
```

---

## Development Server

Run:

```bash
ng serve
```

Then navigate to:

```text
http://localhost:4200/
```

The application automatically reloads when source files are modified.

---

## Build

Run:

```bash
ng build
```

The generated build artifacts are stored in the:

```text
dist/
```

directory.

For a production build, depending on the Angular configuration, use:

```bash
ng build --configuration production
```

---

## Code Scaffolding

Angular CLI can be used to generate new components:

```bash
ng generate component component-name
```

Other Angular elements can be generated using:

```bash
ng generate directive directive-name
ng generate pipe pipe-name
ng generate service service-name
ng generate guard guard-name
ng generate interface interface-name
ng generate class class-name
ng generate enum enum-name
ng generate module module-name
```

---

## Unit Tests

Run:

```bash
ng test
```

This executes the project's unit tests.

---

## End-to-End Tests

Run:

```bash
ng e2e
```

An end-to-end testing package must first be configured in the project if one is not already available.

---

## Security Considerations

MSAL applications running in the browser are **public clients**. Any configuration downloaded by the Angular frontend can be inspected by users.

For this reason, runtime configuration can contain public application settings, but it should never contain:

```text
Client secrets
Passwords
Database credentials
Private API keys
Private connection strings
Service credentials
```

For example, an Entra **Client ID is not a secret** and can be used by the frontend. A **Client Secret**, by contrast, must never be included in an Angular application or its runtime configuration.

Sensitive operations should be handled by a backend service or another appropriate server-side Azure resource.

---

## Benefits of Dynamic Configuration

The main advantage of this architecture is the separation between the application build and selected deployment-specific settings.

Instead of rebuilding the Angular application only because an environment-dependent value has changed, the architecture can support a flow closer to:

```text
          Angular Build
                │
                ▼
        Deploy Application
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
      DEV      TEST     PROD
       │        │        │
       ▼        ▼        ▼
   DEV Config TEST Config PROD Config
```

This can support a **build once, deploy across environments** strategy when the surrounding deployment architecture is designed accordingly.

---

## Further Help

For additional Angular CLI commands, run:

```bash
ng help
```

Refer to the official documentation for more information:

* Angular documentation
* Angular CLI documentation
* Microsoft Authentication Library (MSAL) documentation
* Microsoft Entra ID documentation
* Azure Static Web Apps documentation

---

## Conclusion

This POC demonstrates how an **Angular application**, **MSAL authentication**, **Microsoft Entra ID**, and **Azure Static Web Apps** can be combined with a runtime configuration strategy.

The architecture separates three concerns:

```text
Application Code
       +
Authentication
       +
Environment Configuration
       │
       ▼
Deployable Angular Application
```

The main purpose is to make the application's authentication and deployment configuration easier to manage across environments while keeping sensitive credentials outside the browser.
