import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { name: "Food & Meals", color: "#ef4444", icon: "utensils" },
  { name: "Transport", color: "#f97316", icon: "car" },
  { name: "School Supplies", color: "#eab308", icon: "book" },
  { name: "Load / Data", color: "#22c55e", icon: "wifi" },
  { name: "Entertainment", color: "#8b5cf6", icon: "film" },
  { name: "Personal Care", color: "#ec4899", icon: "heart" },
  { name: "Savings", color: "#06b6d4", icon: "piggy-bank" },
  { name: "Allowance", color: "#10b981", icon: "wallet" },
  { name: "Part-time", color: "#3b82f6", icon: "briefcase" },
  { name: "Others", color: "#64748b", icon: "more-horizontal" },
];

async function main() {
  const demoEmail = "demo@student.local";
  let user = await prisma.user.findUnique({ where: { email: demoEmail } });

  if (!user) {
    const hashed = await hash("demo1234", 10);
    user = await prisma.user.create({
      data: {
        email: demoEmail,
        name: "Demo Student",
        password: hashed,
      },
    });
  }

  const existingDefaults = await prisma.category.findMany({
    where: { isDefault: true },
  });
  if (existingDefaults.length === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((c) => ({
        name: c.name,
        color: c.color,
        icon: c.icon,
        isDefault: true,
        userId: null,
      })),
    });
  }

  console.log("Seed completed. Demo user:", demoEmail, "password: demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
