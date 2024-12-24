// prisma/seed.ts
import { PrismaClient, FamilyStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.$transaction([
    prisma.ruleAudit.deleteMany(),
    prisma.document.deleteMany(),
    prisma.application.deleteMany(),
    prisma.ruleVersion.deleteMany(),
    prisma.rule.deleteMany(),
    prisma.school.deleteMany(),
  ])

  const bronxSchool = await prisma.school.create({
    data: { name: 'Bronx Academy' },
  })

  const brooklynSchool = await prisma.school.create({
    data: { name: 'Brooklyn Prep' },
  })

  const businessOwnerRule = await prisma.rule.create({
    data: {
      versions: {
        create: {
          name: 'Business Owner Documents',
          description: 'Request additional documents from business owners',
          version: 0,
          ruleJson: {
            conditions: [{ fact: 'isBusinessOwner', value: true }],
            actions: [
              {
                type: 'DOCUMENT_REQUEST',
                documentType: 'BUSINESS_TAX',
                description: 'Business tax documents required',
              },
            ],
          },
        },
      },
    },
  })

  const newFamilyRule = await prisma.rule.create({
    data: {
      versions: {
        create: {
          name: 'New Family Verification',
          description: 'Request verification from new families',
          version: 0,
          ruleJson: {
            conditions: [{ fact: 'familyStatus', value: 'NEW' }],
            actions: [
              {
                type: 'DOCUMENT_REQUEST',
                documentType: 'PARENT_A_WAIVER',
                description: 'New family verification form',
              },
            ],
          },
        },
      },
    },
  })

  const complexRule = await prisma.rule.create({
    data: {
      versions: {
        create: {
          name: 'New Business Owner Verification',
          description: 'Additional verification for new business owners',
          version: 0,
          ruleJson: {
            conditions: [
              { fact: 'familyStatus', value: 'NEW' },
              { fact: 'isBusinessOwner', value: true },
            ],
            actions: [
              {
                type: 'DOCUMENT_REQUEST',
                documentType: 'BUSINESS_TAX',
                description: 'Business documentation required',
              },
              {
                type: 'DOCUMENT_REQUEST',
                documentType: 'TAX_K1',
                description: 'K1 form required for business verification',
              },
            ],
          },
        },
      },
    },
  })

  const applications = await Promise.all([
    // New family application without business
    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: false,
        filedUsTaxes2021: true,
        status: 'SUBMITTED',
        documents: {
          create: [
            {
              type: 'TAX_1040',
              status: 'SUBMITTED',
              submittedAt: new Date(),
              url: 'https://example.com/new-family-1040.pdf',
            },
          ],
        },
      },
    }),

    // New business owner application
    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
        status: 'SUBMITTED',
        documents: {
          create: [
            {
              type: 'TAX_1040',
              status: 'SUBMITTED',
              submittedAt: new Date(),
              url: 'https://example.com/new-business-1040.pdf',
            },
          ],
        },
      },
    }),

    // No 2021 taxes application
    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.RETURNING,
        isBusinessOwner: false,
        filedUsTaxes2021: false,
        status: 'SUBMITTED',
        documents: {
          create: [
            {
              type: 'PARENT_A_WAIVER',
              status: 'PENDING',
            },
          ],
        },
      },
    }),

    // Complex case: New business owner without 2021 taxes
    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: true,
        filedUsTaxes2021: false,
        status: 'SUBMITTED',
        documents: {
          create: [
            {
              type: 'PARENT_A_WAIVER',
              status: 'PENDING',
            },
            {
              type: 'BANK_STATEMENT',
              status: 'PENDING',
            },
          ],
        },
      },
    }),

    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.RETURNING,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
        documents: {
          create: {
            type: 'TAX_1040',
            status: 'SUBMITTED',
            submittedAt: new Date(),
            url: 'https://example.com/1040.pdf',
          },
        },
      },
    }),

    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: false,
        filedUsTaxes2021: false,
        documents: {
          create: {
            type: 'TAX_1040',
            status: 'SUBMITTED',
            submittedAt: new Date(),
            url: 'https://example.com/1040.pdf',
          },
        },
      },
    }),
  ])

  console.log('Database seeded!')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
