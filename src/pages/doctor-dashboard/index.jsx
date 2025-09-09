import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import PatientListTable from './components/PatientListTable';
import FilterControls from './components/FilterControls';
import EmergencyAlertsPanel from './components/EmergencyAlertsPanel';
import SummaryMetricsCards from './components/SummaryMetricsCards';
import QuickActionsPanel from './components/QuickActionsPanel';

const DoctorDashboard = () => {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    complianceFilter: 'all',
    riskFilter: 'all',
    dateRange: { start: '', end: '' }
  });

  // Mock patient data
  const mockPatients = [
    {
      id: 'p001',
      patientId: 'PT-2024-001',
      name: 'John Smith',
      dischargeDate: '2024-01-15',
      adherenceRate: 92.5,
      complianceStatus: 'Excellent',
      riskLevel: 'Low',
      lastActivity: '2024-01-20T10:30:00Z'
    },
    {
      id: 'p002',
      patientId: 'PT-2024-002',
      name: 'Sarah Johnson',
      dischargeDate: '2024-01-18',
      adherenceRate: 78.3,
      complianceStatus: 'Good',
      riskLevel: 'Medium',
      lastActivity: '2024-01-20T14:15:00Z'
    },
    {
      id: 'p003',
      patientId: 'PT-2024-003',
      name: 'Michael Brown',
      dischargeDate: '2024-01-12',
      adherenceRate: 45.2,
      complianceStatus: 'Poor',
      riskLevel: 'High',
      lastActivity: '2024-01-19T09:45:00Z'
    },
    {
      id: 'p004',
      patientId: 'PT-2024-004',
      name: 'Emily Davis',
      dischargeDate: '2024-01-20',
      adherenceRate: 88.7,
      complianceStatus: 'Good',
      riskLevel: 'Low',
      lastActivity: '2024-01-20T16:20:00Z'
    },
    {
      id: 'p005',
      patientId: 'PT-2024-005',
      name: 'Robert Wilson',
      dischargeDate: '2024-01-10',
      adherenceRate: 34.8,
      complianceStatus: 'Poor',
      riskLevel: 'Critical',
      lastActivity: '2024-01-18T11:30:00Z'
    },
    {
      id: 'p006',
      patientId: 'PT-2024-006',
      name: 'Lisa Anderson',
      dischargeDate: '2024-01-22',
      adherenceRate: 95.1,
      complianceStatus: 'Excellent',
      riskLevel: 'Low',
      lastActivity: '2024-01-20T13:45:00Z'
    },
    {
      id: 'p007',
      patientId: 'PT-2024-007',
      name: 'David Martinez',
      dischargeDate: '2024-01-14',
      adherenceRate: 67.4,
      complianceStatus: 'Fair',
      riskLevel: 'Medium',
      lastActivity: '2024-01-20T08:15:00Z'
    },
    {
      id: 'p008',
      patientId: 'PT-2024-008',
      name: 'Jennifer Taylor',
      dischargeDate: '2024-01-16',
      adherenceRate: 82.9,
      complianceStatus: 'Good',
      riskLevel: 'Low',
      lastActivity: '2024-01-20T15:30:00Z'
    }
  ];

  // Mock emergency alerts
  const mockAlerts = [
    {
      id: 'alert-001',
      type: 'critical',
      priority: 'critical',
      title: 'Critical Medication Non-Adherence',
      message: 'Patient has missed 3 consecutive doses of critical heart medication',
      patientName: 'Robert Wilson',
      timestamp: '2024-01-20T16:45:00Z',
      details: {
        medication: 'Metoprolol 50mg',
        missedDoses: 3,
        lastTaken: '2024-01-17T08:00:00Z',
        riskLevel: 'Critical'
      },
      actions: [
        { type: 'call-patient', label: 'Call Patient', primary: true },
        { type: 'emergency-contact', label: 'Contact Emergency' }
      ]
    },
    {
      id: 'alert-002',
      type: 'vitals',
      priority: 'high',
      title: 'Abnormal Vital Signs Detected',
      message: 'Blood pressure readings consistently above normal range',
      patientName: 'Michael Brown',
      timestamp: '2024-01-20T15:20:00Z',
      details: {
        systolic: 165,
        diastolic: 98,
        heartRate: 92,
        lastReading: '2024-01-20T15:00:00Z'
      },
      actions: [
        { type: 'review-vitals', label: 'Review Vitals', primary: true },
        { type: 'adjust-medication', label: 'Adjust Medication' }
      ]
    },
    {
      id: 'alert-003',
      type: 'medication',
      priority: 'medium',
      title: 'Medication Interaction Warning',
      message: 'Potential interaction detected between prescribed medications',
      patientName: 'Sarah Johnson',
      timestamp: '2024-01-20T14:30:00Z',
      details: {
        medication1: 'Warfarin 5mg',
        medication2: 'Aspirin 81mg',
        interactionLevel: 'Moderate',
        recommendation: 'Monitor INR levels closely'
      },
      actions: [
        { type: 'review-medications', label: 'Review Medications', primary: true }
      ]
    }
  ];

  // Filter patients based on current filters
  const filteredPatients = useMemo(() => {
    return mockPatients?.filter(patient => {
      // Search filter
      if (filters?.searchTerm) {
        const searchLower = filters?.searchTerm?.toLowerCase();
        if (!patient?.name?.toLowerCase()?.includes(searchLower) && 
            !patient?.patientId?.toLowerCase()?.includes(searchLower)) {
          return false;
        }
      }

      // Compliance filter
      if (filters?.complianceFilter !== 'all') {
        if (patient?.complianceStatus?.toLowerCase() !== filters?.complianceFilter) {
          return false;
        }
      }

      // Risk filter
      if (filters?.riskFilter !== 'all') {
        if (patient?.riskLevel?.toLowerCase() !== filters?.riskFilter) {
          return false;
        }
      }

      // Date range filter
      if (filters?.dateRange?.start || filters?.dateRange?.end) {
        const dischargeDate = new Date(patient.dischargeDate);
        if (filters?.dateRange?.start && dischargeDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters?.dateRange?.end && dischargeDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalPatients = filteredPatients?.length;
    const overallAdherence = totalPatients > 0 
      ? filteredPatients?.reduce((sum, p) => sum + p?.adherenceRate, 0) / totalPatients
      : 0;
    const activeAlerts = mockAlerts?.length;
    const pendingActions = selectedPatients?.length + mockAlerts?.filter(a => a?.priority === 'critical')?.length;

    return [
      {
        id: 'total-patients',
        type: 'patients',
        title: 'Total Patients',
        value: totalPatients,
        unit: '',
        trend: 12,
        trendPeriod: 'vs last month',
        description: 'Active monitored patients',
        target: null,
        clickable: true
      },
      {
        id: 'overall-adherence',
        type: 'adherence',
        title: 'Overall Adherence',
        value: overallAdherence,
        unit: '%',
        trend: 2.1,
        trendPeriod: 'vs last week',
        description: 'Average medication adherence',
        target: 90,
        clickable: true
      },
      {
        id: 'active-alerts',
        type: 'alerts',
        title: 'Active Alerts',
        value: activeAlerts,
        unit: '',
        trend: -3,
        trendPeriod: 'vs yesterday',
        description: 'Requiring immediate attention',
        target: 0,
        clickable: true
      },
      {
        id: 'pending-actions',
        type: 'actions',
        title: 'Pending Actions',
        value: pendingActions,
        unit: '',
        trend: -5,
        trendPeriod: 'vs yesterday',
        description: 'Tasks awaiting review',
        target: 0,
        clickable: true
      }
    ];
  }, [filteredPatients, selectedPatients]);

  // Event handlers
  const handlePatientClick = (patient) => {
    window.location.href = `/patient-profile?id=${patient?.id}`;
  };

  const handleBulkMessage = (patientIds) => {
    console.log('Sending bulk message to patients:', patientIds);
    // Implementation for bulk messaging
  };

  const handleAlertAction = (alertId, actionType) => {
    console.log('Alert action:', alertId, actionType);
    // Implementation for alert actions
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismissing alert:', alertId);
    // Implementation for dismissing alerts
  };

  const handleMetricCardClick = (metricId, metric) => {
    console.log('Metric card clicked:', metricId, metric);
    // Implementation for metric card navigation
  };

  const handleQuickAction = (actionType, action) => {
    console.log('Quick action:', actionType, action);
    // Implementation for quick actions
  };

  const breadcrumbItems = [
    { label: 'Dashboard', clickable: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        userRole="doctor" 
        userName="Dr. Sarah Johnson"
        onToggleSidebar={() => {}}
      />
      {/* Emergency Alert Banner */}
      <EmergencyAlertBanner 
        userRole="doctor"
        alerts={mockAlerts}
      />
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation 
            items={breadcrumbItems}
            userRole="doctor"
            showBackButton={false}
            onBack={() => {}}
          />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Doctor Dashboard</h1>
            <p className="text-text-secondary">
              Monitor patient compliance and manage post-discharge care coordination
            </p>
          </div>

          {/* Summary Metrics */}
          <SummaryMetricsCards 
            metrics={summaryMetrics}
            onCardClick={handleMetricCardClick}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Patient Management */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filter Controls */}
              <FilterControls 
                onFiltersChange={setFilters}
                patientCount={filteredPatients?.length}
                totalPatients={mockPatients?.length}
              />

              {/* Patient List Table */}
              <PatientListTable 
                patients={filteredPatients}
                onPatientClick={handlePatientClick}
                onBulkMessage={handleBulkMessage}
                selectedPatients={selectedPatients}
                onPatientSelect={setSelectedPatients}
              />
            </div>

            {/* Right Column - Alerts and Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency Alerts Panel */}
              <EmergencyAlertsPanel 
                alerts={mockAlerts}
                onAlertAction={handleAlertAction}
                onDismissAlert={handleDismissAlert}
              />

              {/* Quick Actions Panel */}
              <QuickActionsPanel 
                onActionClick={handleQuickAction}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;