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

  const DOCUMENTS: Record<string, string> = {
    TAX_1040: '1040',
    W2_PARENT_A_PREV: 'W2 Parent A (Previous Year)',
    W2_PARENT_B_PREV: 'W2 Parent B (Previous Year)',
    W2_PARENT_A_CURR: 'W2 Parent A (Current Year)',
    W2_PARENT_B_CURR: 'W2 Parent B (Current Year)',
    PAYSTUB: 'Paystub',
    BUSINESS_TAX: 'Business Tax Documents',
    BANK_STATEMENT: 'Bank Statement',
    TAX_1120S: '1120S',
    K1: 'K1',
    TAX_1065: '1065',
    PARENT_A_WAIVER: 'Parent A Waiver Form',
    PARENT_B_WAIVER: 'Parent B Waiver Form',
    UNEMPLOYMENT: 'Unemployment Benefits Statement',
    TAX_1099: '1099',
    STATE_TAX: 'State Tax Return',
    PROOF_OF_DEBT: 'Proof of Debt',
  }

  for (const [, name] of Object.entries(DOCUMENTS)) {
    await prisma.document.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  const documents = await prisma.document.findMany({
    select: { id: true, name: true },
  })

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
                value: documents.find((d) => d.name === DOCUMENTS.BUSINESS_TAX)
                  ?.id,
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
                value: documents.find(
                  (d) => d.name === DOCUMENTS.PARENT_A_WAIVER,
                )?.id,
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
                value: documents.find((d) => d.name === DOCUMENTS.BUSINESS_TAX)
                  ?.id,
                description: 'Business documentation required',
              },
              {
                type: 'DOCUMENT_REQUEST',
                value: documents.find((d) => d.name === DOCUMENTS.K1)?.id,
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
      },
    }),

    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.RETURNING,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
      },
    }),

    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: false,
        filedUsTaxes2021: false,
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
