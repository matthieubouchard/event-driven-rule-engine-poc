import { PrismaClient, FamilyStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.$transaction([
    prisma.ruleAudit.deleteMany(),
    prisma.documentRequest.deleteMany(),
    prisma.document.deleteMany(),
    prisma.application.deleteMany(),
    prisma.ruleVersion.deleteMany(),
    prisma.rule.deleteMany(),
    prisma.student.deleteMany(),
    prisma.family.deleteMany(),
    prisma.parent.deleteMany(),
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

  const johnSmith = await prisma.parent.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
    },
  })

  const janeSmith = await prisma.parent.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
    },
  })

  const smithFamily = await prisma.family.create({
    data: {
      parentAId: johnSmith.id,
      parentBId: janeSmith.id,
    },
  })

  const smithKids = await Promise.all([
    prisma.student.create({
      data: {
        firstName: 'Jimmy',
        lastName: 'Smith',
        dob: new Date('2010-05-15'),
        familyId: smithFamily.id,
      },
    }),
    prisma.student.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Smith',
        dob: new Date('2012-08-22'),
        familyId: smithFamily.id,
      },
    }),
  ])

  const michaelJohnson = await prisma.parent.create({
    data: {
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@email.com',
    },
  })

  const johnsonFamily = await prisma.family.create({
    data: {
      parentAId: michaelJohnson.id,
    },
  })

  const johnsonKid = await prisma.student.create({
    data: {
      firstName: 'Emma',
      lastName: 'Johnson',
      dob: new Date('2011-03-10'),
      familyId: johnsonFamily.id,
    },
  })

  const robertWilliams = await prisma.parent.create({
    data: {
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.williams@email.com',
    },
  })

  const maryWilliams = await prisma.parent.create({
    data: {
      firstName: 'Mary',
      lastName: 'Williams',
      email: 'mary.williams@email.com',
    },
  })

  const williamsFamily = await prisma.family.create({
    data: {
      parentAId: robertWilliams.id,
      parentBId: maryWilliams.id,
    },
  })

  const williamsKids = await Promise.all([
    prisma.student.create({
      data: {
        firstName: 'David',
        lastName: 'Williams',
        dob: new Date('2009-11-30'),
        familyId: williamsFamily.id,
      },
    }),
    prisma.student.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Williams',
        dob: new Date('2013-04-18'),
        familyId: williamsFamily.id,
      },
    }),
  ])

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
    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: false,
        filedUsTaxes2021: true,
        status: 'SUBMITTED',
        studentId: smithKids[0].id,
      },
    }),

    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
        status: 'SUBMITTED',
        studentId: johnsonKid.id,
      },
    }),

    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.RETURNING,
        isBusinessOwner: false,
        filedUsTaxes2021: false,
        status: 'SUBMITTED',
        studentId: williamsKids[0].id,
      },
    }),

    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: true,
        filedUsTaxes2021: false,
        status: 'SUBMITTED',
        studentId: smithKids[1].id,
      },
    }),

    prisma.application.create({
      data: {
        schoolId: bronxSchool.id,
        familyStatus: FamilyStatus.RETURNING,
        isBusinessOwner: true,
        filedUsTaxes2021: true,
        studentId: williamsKids[1].id,
      },
    }),

    prisma.application.create({
      data: {
        schoolId: brooklynSchool.id,
        familyStatus: FamilyStatus.NEW,
        isBusinessOwner: false,
        filedUsTaxes2021: false,
        studentId: johnsonKid.id,
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
