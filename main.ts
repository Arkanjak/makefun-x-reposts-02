import { readFileSync } from "node:fs";
import { join } from "node:path";

const postsPath = join(import.meta.dirname, "POSTS.json");

let raw: string;
try {
  raw = readFileSync(postsPath, "utf8");
} catch {
  console.error(`Cannot read POSTS.json at ${postsPath}`);
  process.exit(1);
}

let data: unknown;
try {
  data = JSON.parse(raw);
} catch {
  console.error("POSTS.json is not valid JSON");
  process.exit(1);
}

if (typeof data !== "object" || data === null || !("posts" in data)) {
  console.error('POSTS.json must be an object with a "posts" array');
  process.exit(1);
}

const posts = (data as { posts: unknown }).posts;
if (!Array.isArray(posts)) {
  console.error('"posts" must be an array');
  process.exit(1);
}

if (posts.length === 0) {
  console.error('"posts" must not be empty');
  process.exit(1);
}

const pattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/;
for (const entry of posts) {
  if (typeof entry !== "string" || !pattern.test(entry)) {
    console.error(`Invalid post URL: ${String(entry)}`);
    process.exit(1);
  }
}

console.log(`Posts: ${posts.length}`);
for (const url of posts) {
  console.log(url);
}
