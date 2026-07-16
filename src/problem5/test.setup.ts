
const base = process.env.DATABASE_URL;
if (base && !base.includes("schema=")) {
  process.env.DATABASE_URL = `${base}&schema=test`;
}
