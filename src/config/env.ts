// Environment variables
export const ENV = {
  MISTRAL_API_KEY: import.meta.env.VITE_MISTRAL_API_KEY as string,
  NODE_ENV: import.meta.env.MODE as string,
  IS_DEVELOPMENT: import.meta.env.DEV as boolean,
  IS_PRODUCTION: import.meta.env.PROD as boolean,
};

// Validate required environment variables
const requiredEnvVars = ['MISTRAL_API_KEY'];

for (const envVar of requiredEnvVars) {
  if (!ENV[envVar as keyof typeof ENV]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default ENV; 