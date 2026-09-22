import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRisk } from '@/lib/risk-engine';

export async function GET() {
  try {
    const reports = await prisma.healthReport.findMany({
      include: { animal: true, symptoms: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(reports);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      animalId,
      reporterId,
      symptoms,
      severity,
      deaths,
      animalsAffected,
      vaccinatedCount,
      locationVillage,
      locationBlock,
      locationDistrict,
      latitude,
      longitude,
      temperature,
      duration,
      additionalNotes,
    } = body;

    if (!animalId || !reporterId || !locationVillage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Count nearby cases in the same village in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const nearbyCases = await prisma.healthReport.count({
      where: {
        locationVillage,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    // Run risk engine
    const riskResult = calculateRisk({
      severity: severity || 'MILD',
      nearbyCases,
      mortality: deaths || 0,
      vaccinationGap: false, // default for now
      historicalTrendScore: Math.min(nearbyCases, 10),
      environmentalContextScore: 0,
    });

    // Create report + symptoms in a transaction
    const report = await prisma.$transaction(async (tx: any) => {
      const newReport = await tx.healthReport.create({
        data: {
          animalId,
          reporterId,
          severity: severity || 'MILD',
          deaths: deaths || 0,
          animalsAffected: animalsAffected || 1,
          vaccinatedCount: vaccinatedCount || 0,
          locationVillage,
          locationBlock: locationBlock || '',
          locationDistrict: locationDistrict || '',
          latitude: latitude || null,
          longitude: longitude || null,
          temperature: temperature ? parseFloat(temperature) : null,
          duration: duration ? parseInt(duration) : null,
          additionalNotes: additionalNotes || null,
          riskScore: riskResult.riskScore,
          riskLevel: riskResult.riskLevel,
          riskFactors: riskResult.factors.join(', '),
          recommendedAction: riskResult.recommendedAction,
        },
      });

      // Save symptoms
      if (symptoms && symptoms.length > 0) {
        await tx.symptom.createMany({
          data: symptoms.map((name: string) => ({
            name,
            healthReportId: newReport.id,
          })),
        });
      }

      // Create a case automatically
      await tx.case.create({
        data: {
          animalId,
          healthReportId: newReport.id,
          status: 'NEW',
        },
      });

      // If HIGH risk, create an alert
      if (riskResult.riskLevel === 'HIGH') {
        await tx.alert.create({
          data: {
            type: 'HIGH_RISK',
            message: `Possible health risk detected in ${locationVillage}. Risk score: ${riskResult.riskScore}/100. Factors: ${riskResult.factors.join(', ')}.`,
            village: locationVillage,
            block: locationBlock || null,
            district: locationDistrict || null,
          },
        });
      }

      return newReport;
    });

    return NextResponse.json(report, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
