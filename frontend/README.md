## Frontend

This folder contains the frontend application that serves as the interaction layer between the agent and users. It provides a web interface for users to communicate with the agent, see responses, see the chain of thought, and experience the agent's reasoning process.

## Getting Started

First, run the development server:

### Before running the app

- Sign up to [CopilotKit](https://cloud.copilotkit.ai) and get your API
  key.
- create `.env` file: `touch .env` and add `NEXT_PUBLIC_COPILOT_CLOUD_API_KEY=your_api_key`
- Assuming you have the agent running, run CopilotKit CLI: `npx copilotkit@latest dev --port 2024` to start the tunnel

## Install Deps
```bash
npm install
# or
yarn install
# or
pnpm install
```


### Running the app

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
