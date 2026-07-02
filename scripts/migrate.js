/**
 * Migration script: Import markdown posts and profile data to MongoDB
 *
 * Usage:
 *   node scripts/migrate.js          # Execute migration
 *   node scripts/migrate.js --dry-run # Preview mode (no writes)
 */

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const DRY_RUN = process.argv.includes("--dry-run");

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const envPath = path.join(__dirname, "..", file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length) {
          const value = valueParts.join("=").trim();
          process.env[key.trim()] = value;
        }
      });
      break;
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ Error: MONGODB_URI not found in .env.local");
  process.exit(1);
}

const POSTS_DIR = path.join(__dirname, "..", "src", "posts");
const PERSON_DATA_PATH = path.join(__dirname, "..", "public", "personData.json");

async function migrate() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db("kamida-blog");

    // ─── Migrate Posts ───────────────────────────────────────
    console.log("📝 Migrating posts...");
    const fileNames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
    const posts = [];

    for (const fileName of fileNames) {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(POSTS_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const post = {
        slug,
        title: data.title || slug,
        date: data.date || "",
        tag: data.tag || "",
        category: data.category || "",
        excerpt: data.excerpt || "",
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      posts.push(post);
      console.log(`  📄 ${slug} (${post.title})`);
    }

    console.log(`\n  Total: ${posts.length} posts`);

    if (!DRY_RUN) {
      const postsCollection = db.collection("posts");
      for (const post of posts) {
        await postsCollection.updateOne(
          { slug: post.slug },
          { $set: post },
          { upsert: true }
        );
      }
      console.log(`  ✅ Inserted/updated ${posts.length} posts`);
    } else {
      console.log("  ⏭️  Dry run — no writes");
    }

    // ─── Migrate Profile ─────────────────────────────────────
    console.log("\n👤 Migrating profile...");
    const personData = JSON.parse(fs.readFileSync(PERSON_DATA_PATH, "utf8"));
    const profile = {
      name: personData.data.name || "kamida",
      realName: personData.data.realName || "",
      age: personData.data.age || 0,
      avatar: personData.data.avatar || "/img/avatar.jpg",
      bio: personData.data.bio || "",
      motto: "热爱技术的前端开发者，喜欢分享学习心得和技术见解。",
      interests: personData.data.interests || [],
      contact: personData.data.contact || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`  📋 Name: ${profile.name}`);
    console.log(`  📋 Bio: ${profile.bio}`);

    if (!DRY_RUN) {
      const profilesCollection = db.collection("profiles");
      await profilesCollection.updateOne(
        { name: profile.name },
        { $set: profile },
        { upsert: true }
      );
      console.log("  ✅ Inserted/updated profile");
    } else {
      console.log("  ⏭️  Dry run — no writes");
    }

    // ─── Summary ─────────────────────────────────────────────
    console.log("\n" + "=".repeat(40));
    if (DRY_RUN) {
      console.log("🔍 Dry run complete. No data was written.");
      console.log("   Run without --dry-run to execute migration.");
    } else {
      console.log("🎉 Migration complete!");
      console.log(`   Posts: ${posts.length}`);
      console.log("   Profile: 1");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
