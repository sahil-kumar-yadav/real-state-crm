import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPasswordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@recrm.com" },
    update: {},
    create: {
      email: "admin@recrm.com",
      password: adminPasswordHash,
      firstName: "Admin",
      lastName: "User",
      phone: "+91 9876543210",
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create agent users
  const agentPasswordHash = await bcrypt.hash("password123", 10);
  const agents = [];

  for (let i = 1; i <= 3; i++) {
    const agent = await prisma.user.upsert({
      where: { email: `agent${i}@recrm.com` },
      update: {},
      create: {
        email: `agent${i}@recrm.com`,
        password: agentPasswordHash,
        firstName: `Agent`,
        lastName: `${i}`,
        phone: `+91 987654321${i}`,
        role: "AGENT",
        isActive: true,
      },
    });
    agents.push(agent);
    console.log(`✅ Agent user created: ${agent.email}`);

    // Create agent details
    await prisma.agentDetails.upsert({
      where: { userId: agent.id },
      update: {},
      create: {
        userId: agent.id,
        employeeId: `EMP00${i}`,
        status: "ACTIVE",
        commissionRate: 2.5 + i * 0.5,
        specializations: ["residential", "commercial"],
      },
    });
  }

  // Create sample properties
  const properties = [
    {
      title: "Luxurious Apartment in Bandra",
      description: "Beautiful 3-bedroom apartment with sea view",
      type: "APARTMENT" as const,
      status: "AVAILABLE" as const,
      address: "123 Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      furnishedStatus: "FULLY_FURNISHED" as const,
      yearBuilt: 2022,
      notes: "Premium location near beach",
      agentId: agents[0].id,
    },
    {
      title: "Villa in Gurgaon",
      description: "3-storey villa with garden",
      type: "VILLA" as const,
      status: "AVAILABLE" as const,
      address: "456 DLF Phase",
      city: "Gurgaon",
      state: "Haryana",
      zipCode: "122002",
      price: 5000000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 3000,
      furnishedStatus: "SEMI_FURNISHED" as const,
      yearBuilt: 2021,
      notes: "Gated community",
      agentId: agents[1].id,
    },
    {
      title: "Commercial Space in Bangalore",
      description: "Prime commercial office space",
      type: "COMMERCIAL" as const,
      status: "AVAILABLE" as const,
      address: "789 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      price: 1000000,
      squareFeet: 2500,
      furnishedStatus: "UNFURNISHED" as const,
      yearBuilt: 2020,
      notes: "High foot traffic area",
      agentId: agents[2].id,
    },
  ];

  for (const propData of properties) {
    const property = await prisma.property.create({
      data: propData,
    });
    console.log(`✅ Property created: ${property.title}`);
  }

  // Get all properties for lead associations
  const allProperties = await prisma.property.findMany();

  // Create sample leads
  const leads = [
    {
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh@example.com",
      phone: "+91 9876543210",
      type: "BUYER" as const,
      source: "WEBSITE" as const,
      status: "INTERESTED" as const,
      budgetMin: 2000000,
      budgetMax: 3000000,
      interestedPropertyId: allProperties[0]?.id,
      assignedAgentId: agents[0].id,
    },
    {
      firstName: "Priya",
      lastName: "Singh",
      email: "priya@example.com",
      phone: "+91 8765432109",
      type: "SELLER" as const,
      source: "FACEBOOK" as const,
      status: "CONTACTED" as const,
      budgetMin: 4000000,
      budgetMax: 6000000,
      interestedPropertyId: allProperties[1]?.id,
      assignedAgentId: agents[1].id,
    },
    {
      firstName: "Amit",
      lastName: "Patel",
      email: "amit@example.com",
      phone: "+91 7654321098",
      type: "BUYER" as const,
      source: "REFERRAL" as const,
      status: "NEW" as const,
      budgetMin: 500000,
      budgetMax: 1500000,
      interestedPropertyId: allProperties[2]?.id,
      assignedAgentId: agents[2].id,
    },
  ];

  for (const leadData of leads) {
    const lead = await prisma.lead.create({
      data: leadData,
    });
    console.log(`✅ Lead created: ${lead.firstName} ${lead.lastName}`);

    // Add activity
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "CALL",
        title: "Initial Contact",
        notes: "First call with the lead",
      },
    });
  }

  // Create sample property visits
  const allLeads = await prisma.lead.findMany();
  if (allLeads.length > 0) {
    await prisma.propertyVisit.create({
      data: {
        leadId: allLeads[0].id,
        propertyId: allProperties[0].id,
        assignedAgentId: agents[0].id,
        status: "SCHEDULED",
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        notes: "Scheduled for site visit",
      },
    });
    console.log(`✅ Property visit scheduled`);
  }

  // Create sample commissions
  if (allProperties.length > 0) {
    await prisma.commission.create({
      data: {
        agentId: agents[0].id,
        propertyId: allProperties[0].id,
        percentage: 2.5,
        propertyPrice: allProperties[0].price,
        commissionAmount: (allProperties[0].price * 2.5) / 100,
        status: "PENDING",
      },
    });
    console.log(`✅ Commission created`);
  }

  console.log("✨ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
