export interface SecretTemplate {
  /** Human-readable label for the template */
  label: string;
  /** Short description */
  description: string;
  /** Platform/note — e.g. "Supabase", "GitHub" */
  note: string;
  /** The env variables */
  vars: { key: string; valueHint: string }[];
}

export interface TemplateCategory {
  category: string;
  icon: string;
  templates: SecretTemplate[];
}

export const SECRET_TEMPLATES: TemplateCategory[] = [
  {
    category: "AI / LLM APIs",
    icon: "🤖",
    templates: [
      {
        label: "OpenAI",
        description: "OpenAI API access (GPT-4, embeddings, DALL-E)",
        note: "OpenAI Platform",
        vars: [
          { key: "OPENAI_API_KEY", valueHint: "sk-..." },
          { key: "OPENAI_ORGANIZATION", valueHint: "org-..." },
          { key: "OPENAI_BASE_URL", valueHint: "https://api.openai.com/v1" },
        ],
      },
      {
        label: "Anthropic",
        description: "Anthropic Claude API",
        note: "Anthropic",
        vars: [
          { key: "ANTHROPIC_API_KEY", valueHint: "sk-ant-..." },
        ],
      },
      {
        label: "Google Gemini",
        description: "Google Gemini API",
        note: "Google AI",
        vars: [
          { key: "GEMINI_API_KEY", valueHint: "AIza..." },
        ],
      },
      {
        label: "DeepSeek",
        description: "DeepSeek API",
        note: "DeepSeek",
        vars: [
          { key: "DEEPSEEK_API_KEY", valueHint: "sk-..." },
        ],
      },
      {
        label: "Hugging Face",
        description: "Hugging Face model inference & hub",
        note: "HuggingFace",
        vars: [
          { key: "HUGGINGFACE_API_KEY", valueHint: "hf_..." },
          { key: "HUGGINGFACE_TOKEN", valueHint: "hf_..." },
        ],
      },
      {
        label: "Groq",
        description: "Groq LPU inference API",
        note: "Groq",
        vars: [
          { key: "GROQ_API_KEY", valueHint: "gsk_..." },
        ],
      },
      {
        label: "Together AI",
        description: "Together AI inference API",
        note: "Together AI",
        vars: [
          { key: "TOGETHER_API_KEY", valueHint: "t1v..." },
        ],
      },
      {
        label: "Mistral AI",
        description: "Mistral AI API (Le Chat, embeddings)",
        note: "Mistral",
        vars: [
          { key: "MISTRAL_API_KEY", valueHint: "..." },
        ],
      },
      {
        label: "Replicate",
        description: "Replicate API for open-source models",
        note: "Replicate",
        vars: [
          { key: "REPLICATE_API_TOKEN", valueHint: "r8_..." },
        ],
      },
      {
        label: "Cohere",
        description: "Cohere API (embed, generate, classify)",
        note: "Cohere",
        vars: [
          { key: "COHERE_API_KEY", valueHint: "..." },
        ],
      },
    ],
  },
  {
    category: "Databases",
    icon: "🗄️",
    templates: [
      {
        label: "PostgreSQL",
        description: "PostgreSQL connection",
        note: "Supabase / Neon / RDS",
        vars: [
          { key: "DATABASE_URL", valueHint: "postgresql://user:pass@host:5432/db" },
          { key: "PGHOST", valueHint: "localhost" },
          { key: "PGPORT", valueHint: "5432" },
          { key: "PGDATABASE", valueHint: "mydb" },
          { key: "PGUSER", valueHint: "postgres" },
          { key: "PGPASSWORD", valueHint: "********" },
        ],
      },
      {
        label: "MongoDB",
        description: "MongoDB connection",
        note: "MongoDB Atlas / Local",
        vars: [
          { key: "MONGODB_URI", valueHint: "mongodb+srv://user:pass@cluster.mongodb.net/db" },
        ],
      },
      {
        label: "Redis",
        description: "Redis cache / queue connection",
        note: "Redis / Upstash",
        vars: [
          { key: "REDIS_URL", valueHint: "redis://user:pass@host:6379" },
          { key: "REDIS_HOST", valueHint: "localhost" },
          { key: "REDIS_PORT", valueHint: "6379" },
          { key: "REDIS_PASSWORD", valueHint: "********" },
        ],
      },
      {
        label: "MySQL",
        description: "MySQL / MariaDB connection",
        note: "MySQL / PlanetScale",
        vars: [
          { key: "MYSQL_HOST", valueHint: "localhost" },
          { key: "MYSQL_PORT", valueHint: "3306" },
          { key: "MYSQL_DATABASE", valueHint: "mydb" },
          { key: "MYSQL_USER", valueHint: "root" },
          { key: "MYSQL_PASSWORD", valueHint: "********" },
          { key: "DATABASE_URL", valueHint: "mysql://user:pass@host:3306/db" },
        ],
      },
      {
        label: "Supabase",
        description: "Supabase project (Postgres + Auth + Storage)",
        note: "Supabase",
        vars: [
          { key: "SUPABASE_URL", valueHint: "https://xxxxx.supabase.co" },
          { key: "SUPABASE_ANON_KEY", valueHint: "eyJ..." },
          { key: "SUPABASE_SERVICE_ROLE_KEY", valueHint: "eyJ..." },
          { key: "DATABASE_URL", valueHint: "postgresql://..." },
        ],
      },
    ],
  },
  {
    category: "Cloud Providers",
    icon: "☁️",
    templates: [
      {
        label: "AWS",
        description: "Amazon Web Services credentials",
        note: "AWS IAM",
        vars: [
          { key: "AWS_ACCESS_KEY_ID", valueHint: "AKIA..." },
          { key: "AWS_SECRET_ACCESS_KEY", valueHint: "..." },
          { key: "AWS_REGION", valueHint: "us-east-1" },
          { key: "AWS_S3_BUCKET", valueHint: "my-bucket" },
          { key: "AWS_SESSION_TOKEN", valueHint: "..." },
        ],
      },
      {
        label: "Google Cloud",
        description: "Google Cloud Platform",
        note: "GCP",
        vars: [
          { key: "GOOGLE_CLOUD_PROJECT", valueHint: "my-project" },
          { key: "GOOGLE_API_KEY", valueHint: "AIza..." },
          { key: "GOOGLE_APPLICATION_CREDENTIALS", valueHint: "/path/to/service-account.json" },
        ],
      },
      {
        label: "Azure",
        description: "Microsoft Azure",
        note: "Azure",
        vars: [
          { key: "AZURE_TENANT_ID", valueHint: "..." },
          { key: "AZURE_CLIENT_ID", valueHint: "..." },
          { key: "AZURE_CLIENT_SECRET", valueHint: "..." },
          { key: "AZURE_SUBSCRIPTION_ID", valueHint: "..." },
        ],
      },
      {
        label: "Cloudflare",
        description: "Cloudflare API (R2, Workers, DNS)",
        note: "Cloudflare",
        vars: [
          { key: "CLOUDFLARE_API_TOKEN", valueHint: "..." },
          { key: "CLOUDFLARE_ACCOUNT_ID", valueHint: "..." },
          { key: "CLOUDFLARE_ZONE_ID", valueHint: "..." },
        ],
      },
    ],
  },
  {
    category: "Auth & OAuth",
    icon: "🔐",
    templates: [
      {
        label: "NextAuth.js",
        description: "NextAuth.js / Auth.js configuration",
        note: "Auth.js",
        vars: [
          { key: "NEXTAUTH_SECRET", valueHint: "openssl rand -base64 32" },
          { key: "NEXTAUTH_URL", valueHint: "http://localhost:3000" },
          { key: "AUTH_SECRET", valueHint: "..." },
        ],
      },
      {
        label: "GitHub OAuth",
        description: "GitHub OAuth app credentials",
        note: "GitHub OAuth",
        vars: [
          { key: "GITHUB_CLIENT_ID", valueHint: "Iv1..." },
          { key: "GITHUB_CLIENT_SECRET", valueHint: "..." },
        ],
      },
      {
        label: "Google OAuth",
        description: "Google OAuth credentials",
        note: "Google Cloud OAuth",
        vars: [
          { key: "GOOGLE_CLIENT_ID", valueHint: "xxx.apps.googleusercontent.com" },
          { key: "GOOGLE_CLIENT_SECRET", valueHint: "GOCSPX-..." },
        ],
      },
      {
        label: "Auth0",
        description: "Auth0 tenant credentials",
        note: "Auth0",
        vars: [
          { key: "AUTH0_CLIENT_ID", valueHint: "..." },
          { key: "AUTH0_CLIENT_SECRET", valueHint: "..." },
          { key: "AUTH0_ISSUER_BASE_URL", valueHint: "https://xxx.us.auth0.com" },
          { key: "AUTH0_AUDIENCE", valueHint: "https://api.example.com" },
        ],
      },
    ],
  },
  {
    category: "Messaging & Email",
    icon: "✉️",
    templates: [
      {
        label: "Twilio",
        description: "Twilio SMS / Voice API",
        note: "Twilio",
        vars: [
          { key: "TWILIO_ACCOUNT_SID", valueHint: "AC..." },
          { key: "TWILIO_AUTH_TOKEN", valueHint: "..." },
          { key: "TWILIO_PHONE_NUMBER", valueHint: "+15551234567" },
        ],
      },
      {
        label: "Slack",
        description: "Slack bot / webhook integration",
        note: "Slack",
        vars: [
          { key: "SLACK_BOT_TOKEN", valueHint: "xoxb-..." },
          { key: "SLACK_SIGNING_SECRET", valueHint: "..." },
          { key: "SLACK_WEBHOOK_URL", valueHint: "https://hooks.slack.com/services/..." },
        ],
      },
      {
        label: "Telegram Bot",
        description: "Telegram bot API token",
        note: "Telegram",
        vars: [
          { key: "TELEGRAM_BOT_TOKEN", valueHint: "123456:ABC-DEF..." },
          { key: "TELEGRAM_CHAT_ID", valueHint: "-1001234567890" },
        ],
      },
      {
        label: "Resend",
        description: "Resend transactional email",
        note: "Resend",
        vars: [
          { key: "RESEND_API_KEY", valueHint: "re_..." },
        ],
      },
      {
        label: "SendGrid",
        description: "SendGrid email API",
        note: "SendGrid / Twilio",
        vars: [
          { key: "SENDGRID_API_KEY", valueHint: "SG.xxx..." },
          { key: "SENDGRID_FROM_EMAIL", valueHint: "noreply@example.com" },
        ],
      },
    ],
  },
  {
    category: "Payments",
    icon: "💳",
    templates: [
      {
        label: "Stripe",
        description: "Stripe payment processing",
        note: "Stripe",
        vars: [
          { key: "STRIPE_SECRET_KEY", valueHint: "sk_live_..." },
          { key: "STRIPE_PUBLISHABLE_KEY", valueHint: "pk_live_..." },
          { key: "STRIPE_WEBHOOK_SECRET", valueHint: "whsec_..." },
        ],
      },
      {
        label: "Lemon Squeezy",
        description: "Lemon Squeezy payments & licensing",
        note: "Lemon Squeezy",
        vars: [
          { key: "LEMON_SQUEEZY_API_KEY", valueHint: "..." },
          { key: "LEMON_SQUEEZY_STORE_ID", valueHint: "..." },
        ],
      },
    ],
  },
  {
    category: "DevOps & Hosting",
    icon: "🚀",
    templates: [
      {
        label: "GitHub Token",
        description: "GitHub personal access / PAT token",
        note: "GitHub",
        vars: [
          { key: "GITHUB_TOKEN", valueHint: "ghp_..." },
          { key: "GITHUB_USERNAME", valueHint: "username" },
          { key: "GITHUB_REPOSITORY", valueHint: "owner/repo" },
        ],
      },
      {
        label: "Docker Registry",
        description: "Docker Hub or private registry",
        note: "Docker",
        vars: [
          { key: "DOCKER_USERNAME", valueHint: "username" },
          { key: "DOCKER_PASSWORD", valueHint: "..." },
          { key: "DOCKER_REGISTRY", valueHint: "https://index.docker.io/v1/" },
        ],
      },
      {
        label: "Vercel",
        description: "Vercel deployment & environment",
        note: "Vercel",
        vars: [
          { key: "VERCEL_TOKEN", valueHint: "..." },
          { key: "VERCEL_PROJECT_ID", valueHint: "prj_..." },
          { key: "VERCEL_ORG_ID", valueHint: "team_..." },
        ],
      },
      {
        label: "S3 Compatible",
        description: "S3-compatible object storage (MinIO, Backblaze, Wasabi)",
        note: "S3 Storage",
        vars: [
          { key: "S3_ACCESS_KEY_ID", valueHint: "..." },
          { key: "S3_SECRET_ACCESS_KEY", valueHint: "..." },
          { key: "S3_ENDPOINT", valueHint: "https://s3.us-east-1.amazonaws.com" },
          { key: "S3_REGION", valueHint: "us-east-1" },
          { key: "S3_BUCKET", valueHint: "my-bucket" },
        ],
      },
    ],
  },
  {
    category: "Monitoring & Logging",
    icon: "📊",
    templates: [
      {
        label: "Sentry",
        description: "Error tracking & performance monitoring",
        note: "Sentry",
        vars: [
          { key: "SENTRY_DSN", valueHint: "https://xxx@oxxx.ingest.us.sentry.io/..." },
          { key: "SENTRY_ORG", valueHint: "my-org" },
          { key: "SENTRY_PROJECT", valueHint: "my-project" },
          { key: "SENTRY_AUTH_TOKEN", valueHint: "..." },
        ],
      },
      {
        label: "Datadog",
        description: "Datadog monitoring & APM",
        note: "Datadog",
        vars: [
          { key: "DATADOG_API_KEY", valueHint: "..." },
          { key: "DATADOG_APP_KEY", valueHint: "..." },
          { key: "DATADOG_SITE", valueHint: "datadoghq.com" },
        ],
      },
    ],
  },
  {
    category: "General",
    icon: "⚙️",
    templates: [
      {
        label: "App Config",
        description: "Common application environment variables",
        note: "App Config",
        vars: [
          { key: "NODE_ENV", valueHint: "development" },
          { key: "PORT", valueHint: "3000" },
          { key: "HOST", valueHint: "0.0.0.0" },
          { key: "APP_URL", valueHint: "http://localhost:3000" },
          { key: "API_URL", valueHint: "http://localhost:3000/api" },
          { key: "LOG_LEVEL", valueHint: "debug" },
          { key: "CORS_ORIGIN", valueHint: "*" },
        ],
      },
      {
        label: "JWT Auth",
        description: "JWT token configuration",
        note: "JWT Auth",
        vars: [
          { key: "JWT_SECRET", valueHint: "openssl rand -base64 64" },
          { key: "JWT_EXPIRES_IN", valueHint: "7d" },
        ],
      },
      {
        label: "PAOS Agent",
        description: "PAOS Hermes agent configuration",
        note: "PAOS Agent",
        vars: [
          { key: "HERMES_HOME", valueHint: "/home/dev/AI_Workflow/hermes" },
          { key: "HERMES_PROVIDER", valueHint: "deepseek" },
          { key: "HERMES_MODEL", valueHint: "deepseek-v4-flash" },
          { key: "TELEGRAM_BOT_TOKEN", valueHint: "..." },
        ],
      },
    ],
  },
];
