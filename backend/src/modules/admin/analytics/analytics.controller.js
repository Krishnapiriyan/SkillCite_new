import prisma from '../../../config/database.js';
import { successResponse, errorResponse } from '../../../utils/response.util.js';

export const getOverview = async (req, res) => {
  try {
    const [employersCount, candidatesCount, engineeringCount, contactsCount] = await Promise.all([
      prisma.employerRequest.count(),
      prisma.candidateSubmission.count(),
      prisma.engineeringRequest.count(),
      prisma.contactMessage.count(),
    ]);

    // Also fetch the last 10 activities for the dashboard activity feed
    const [recentEmployers, recentCandidates, recentEngineering, recentContacts] = await Promise.all([
      prisma.employerRequest.findMany({ take: 5, orderBy: { submittedAt: 'desc' } }),
      prisma.candidateSubmission.findMany({ take: 5, orderBy: { submittedAt: 'desc' } }),
      prisma.engineeringRequest.findMany({ take: 5, orderBy: { submittedAt: 'desc' } }),
      prisma.contactMessage.findMany({ take: 5, orderBy: { submittedAt: 'desc' } }),
    ]);

    // Format all activities in a single sorted feed
    const feed = [
      ...recentEmployers.map(item => ({ id: item.id, type: 'employer', name: item.companyName, contact: item.contactPerson, date: item.submittedAt, isRead: item.isRead })),
      ...recentCandidates.map(item => ({ id: item.id, type: 'candidate', name: `${item.firstName} ${item.lastName}`, contact: item.preferredRole, date: item.submittedAt, isRead: item.isRead })),
      ...recentEngineering.map(item => ({ id: item.id, type: 'engineering', name: item.fullName, contact: item.serviceType, date: item.submittedAt, isRead: item.isRead })),
      ...recentContacts.map(item => ({ id: item.id, type: 'contact', name: item.fullName, contact: item.enquiryType, date: item.submittedAt, isRead: item.isRead })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return successResponse(res, 200, 'Overview stats retrieved successfully', {
      counts: {
        employers: employersCount,
        candidates: candidatesCount,
        engineering: engineeringCount,
        contacts: contactsCount,
        total: employersCount + candidatesCount + engineeringCount + contactsCount,
      },
      recentActivity: feed,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getSubmissionsTrend = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [employers, candidates, engineering, contacts] = await Promise.all([
      prisma.employerRequest.findMany({ where: { submittedAt: { gte: thirtyDaysAgo } } }),
      prisma.candidateSubmission.findMany({ where: { submittedAt: { gte: thirtyDaysAgo } } }),
      prisma.engineeringRequest.findMany({ where: { submittedAt: { gte: thirtyDaysAgo } } }),
      prisma.contactMessage.findMany({ where: { submittedAt: { gte: thirtyDaysAgo } } }),
    ]);

    // Build list of dates for the last 30 days
    const trendMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap[dateStr] = { date: dateStr, employers: 0, candidates: 0, engineering: 0, contacts: 0, total: 0 };
    }

    // Populate counts
    employers.forEach(item => {
      const dateStr = item.submittedAt.toISOString().split('T')[0];
      if (trendMap[dateStr]) { trendMap[dateStr].employers++; trendMap[dateStr].total++; }
    });
    candidates.forEach(item => {
      const dateStr = item.submittedAt.toISOString().split('T')[0];
      if (trendMap[dateStr]) { trendMap[dateStr].candidates++; trendMap[dateStr].total++; }
    });
    engineering.forEach(item => {
      const dateStr = item.submittedAt.toISOString().split('T')[0];
      if (trendMap[dateStr]) { trendMap[dateStr].engineering++; trendMap[dateStr].total++; }
    });
    contacts.forEach(item => {
      const dateStr = item.submittedAt.toISOString().split('T')[0];
      if (trendMap[dateStr]) { trendMap[dateStr].contacts++; trendMap[dateStr].total++; }
    });

    const data = Object.values(trendMap);
    return successResponse(res, 200, 'Submissions trend retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getSpecialtySplit = async (req, res) => {
  try {
    const employers = await prisma.employerRequest.groupBy({
      by: ['specialty'],
      _count: { specialty: true }
    });

    const candidates = await prisma.candidateSubmission.groupBy({
      by: ['specialty'],
      _count: { specialty: true }
    });

    const counts = {
      engineering: 0,
      accounting: 0,
      administrative: 0,
      other: 0,
    };

    employers.forEach(item => {
      const key = item.specialty.toLowerCase();
      if (key in counts) counts[key] += item._count.specialty;
      else counts.other += item._count.specialty;
    });

    candidates.forEach(item => {
      const key = item.specialty.toLowerCase();
      if (key in counts) counts[key] += item._count.specialty;
      else counts.other += item._count.specialty;
    });

    const data = [
      { name: 'Engineering', value: counts.engineering },
      { name: 'Accounting', value: counts.accounting },
      { name: 'Administrative', value: counts.administrative },
      { name: 'Other', value: counts.other },
    ];

    return successResponse(res, 200, 'Specialty split retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getNotificationCounts = async (req, res) => {
  try {
    const [employers, candidates, engineering, contacts] = await Promise.all([
      prisma.employerRequest.count({ where: { isRead: false } }),
      prisma.candidateSubmission.count({ where: { isRead: false } }),
      prisma.engineeringRequest.count({ where: { isRead: false } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    return successResponse(res, 200, 'Notification counts retrieved successfully', {
      employers,
      candidates,
      engineering,
      contacts,
      total: employers + candidates + engineering + contacts
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Promise.all([
      prisma.employerRequest.updateMany({ where: { isRead: false }, data: { isRead: true } }),
      prisma.candidateSubmission.updateMany({ where: { isRead: false }, data: { isRead: true } }),
      prisma.engineeringRequest.updateMany({ where: { isRead: false }, data: { isRead: true } }),
      prisma.contactMessage.updateMany({ where: { isRead: false }, data: { isRead: true } }),
    ]);
    return successResponse(res, 200, 'All items marked as read successfully', {});
  } catch (error) {
    return errorResponse(res, error);
  }
};
