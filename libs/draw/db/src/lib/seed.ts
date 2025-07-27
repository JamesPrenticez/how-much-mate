import { posts, users } from "./schema";

export async function seedDatabase(db: any) {
  // Insert sample users
  const seedUsers = await db.insert(users).values([
    { name: 'Alice Johnson', email: 'alice@example.com', age: 28 },
    { name: 'Bob Smith', email: 'bob@example.com', age: 32 },
    { name: 'Carol White', email: 'carol@example.com', age: 24 },
    { name: 'David Brown', email: 'david@example.com', age: 35 },
    { name: 'Emma Davis', email: 'emma@example.com', age: 29 }
  ]).returning();

  // Insert sample posts
  await db.insert(posts).values([
    { title: 'Getting Started with SQLite', content: 'SQLite is a lightweight database...', authorId: seedUsers[0].id },
    { title: 'Web Development Tips', content: 'Here are some useful tips...', authorId: seedUsers[1].id },
    { title: 'Database Design Patterns', content: 'Best practices for database design...', authorId: seedUsers[0].id },
    { title: 'JavaScript Performance', content: 'Optimizing your JS applications...', authorId: seedUsers[2].id },
    { title: 'Modern CSS Techniques', content: 'Latest CSS features and techniques...', authorId: seedUsers[3].id },
    { title: 'API Design Guidelines', content: 'How to design great APIs...', authorId: seedUsers[1].id },
    { title: 'TypeScript Best Practices', content: 'Writing better TypeScript code...', authorId: seedUsers[4].id }
  ]);

  console.log(`✅ Database seeded with ${seedUsers.length} users and 7 posts`);
  return seedUsers;
}