
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, Users, FileText, Calendar, MapPin } from 'lucide-react';
import { ApplicationForm } from './ApplicationForm';
import { PipelineView } from './PipelineView';
import { AlertBar } from './AlertBar';
import { ApplicantCard } from './ApplicantCard';

interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  has_pa_license: boolean;
  has_bond: boolean;
  license_state?: string;
  next_action_due?: string;
  created_at: string;
  specialties?: string[];
  deployment_region?: string[];
}

const CANDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);

  // Mock data for development
  useEffect(() => {
    const mockApplicants: Applicant[] = [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        status: 'application_submitted',
        has_pa_license: true,
        has_bond: true,
        license_state: 'FL',
        next_action_due: '2025-01-23T10:00:00Z',
        created_at: '2025-01-21T08:30:00Z',
        specialties: ['Wind', 'Flood'],
        deployment_region: ['South Florida']
      },
      {
        id: '2',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '(555) 987-6543',
        status: 'compliance_verification',
        has_pa_license: true,
        has_bond: true,
        license_state: 'TX',
        next_action_due: '2025-01-22T14:00:00Z',
        created_at: '2025-01-20T11:15:00Z',
        specialties: ['Commercial', 'Residential']
      },
      {
        id: '3',
        first_name: 'Mike',
        last_name: 'Williams',
        email: 'mike.williams@example.com',
        phone: '(555) 456-7890',
        status: 'contract_sent',
        has_pa_license: true,
        has_bond: true,
        license_state: 'GA',
        created_at: '2025-01-19T16:45:00Z',
        specialties: ['Wind', 'Hail']
      }
    ];
    
    setApplicants(mockApplicants);
    
    // Calculate overdue items
    const now = new Date();
    const overdue = mockApplicants.filter(app => 
      app.next_action_due && new Date(app.next_action_due) < now
    );
    setOverdueCount(overdue.length);
  }, []);

  const getStatusStats = () => {
    const stats = {
      new_applications: applicants.filter(a => a.status === 'application_submitted').length,
      in_compliance: applicants.filter(a => a.status === 'compliance_verification').length,
      contracts_pending: applicants.filter(a => a.status === 'contract_sent').length,
      in_interviews: applicants.filter(a => a.status.includes('interview')).length,
      ready_to_deploy: applicants.filter(a => a.status === 'active_not_deployed').length,
      deployed: applicants.filter(a => a.status === 'deployed').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ocean-deep mb-2">
              CAN Onboarding Pipeline
            </h1>
            <p className="text-muted-foreground">
              Coastal Adjuster Network - Automated Onboarding System
            </p>
          </div>
          <Button 
            onClick={() => setShowApplicationForm(true)}
            className="ocean-gradient text-white hover:opacity-90 transition-opacity"
          >
            <Users className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        {/* Alert Bar */}
        <AlertBar overdueCount={overdueCount} />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="pipeline-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-status-submitted"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Apps</p>
                  <p className="text-2xl font-bold text-ocean-primary">{stats.new_applications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pipeline-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-status-review"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.in_compliance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pipeline-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-status-contract"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contracts</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.contracts_pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pipeline-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-status-interview"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.in_interviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pipeline-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-status-active"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.ready_to_deploy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pipeline-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-status-deployed"></div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Deployed</p>
                  <p className="text-2xl font-bold text-ocean-deep">{stats.deployed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-white shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">New Apps</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="deployed">Deployed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PipelineView applicants={applicants} />
          </TabsContent>

          <TabsContent value="applications">
            <div className="grid gap-4">
              {applicants
                .filter(a => a.status === 'application_submitted')
                .map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid gap-4">
              {applicants
                .filter(a => a.status === 'compliance_verification')
                .map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="contracts">
            <div className="grid gap-4">
              {applicants
                .filter(a => a.status === 'contract_sent')
                .map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="interviews">
            <div className="grid gap-4">
              {applicants
                .filter(a => a.status.includes('interview'))
                .map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="ready">
            <div className="grid gap-4">
              {applicants
                .filter(a => a.status === 'active_not_deployed')
                .map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="deployed">
            <div className="grid gap-4">
              {applicants
                .filter(a => a.status === 'deployed')
                .map(applicant => (
                  <ApplicantCard key={applicant.id} applicant={applicant} />
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="grid gap-4">
              {applicants.map(applicant => (
                <ApplicantCard key={applicant.id} applicant={applicant} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <ApplicationForm
            onClose={() => setShowApplicationForm(false)}
            onSubmit={(data) => {
              console.log('New application:', data);
              setShowApplicationForm(false);
              // In real app, this would add to database
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CANDashboard;
