# PROD

> Explanation of how I would extend or improve the application design if I were building this for production.

## Environment variables

Instead of having harcoded URLs or any other environment-aware variables, I would create `.env`, `.env.development` and `.env.production` files with those variables.

## Monorepo

In a production-ready setting, I would use a monorepo approach where both the server and client use TypeScript, allowing different apps to share library projects and configurations.

## IO validation

To make the app more robust, I would likely use a JSON Schema validator library such as [Zod](https://zod.dev/) to validate environment variables and other I/O values, such as API request/response data.

## State management

This application is read-only, but if we were to start adding interactivity, I would begin using a state management library such as Redux or Zustand. This approach models interactions around a centralized store management solution, proven effective in large-scale deployments and beneficial for teams using a common language: actions, stores, reducers, and side-effects.
