
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface PipelineViewProps {
  applicants: Applicant[];
}

const PIPELINE_STAGES = [
  {
    id: 'application_submitted',
    title: 'New Applications',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Recently submitted applications'
  },
  {
    id: 'compliance_verification',
    title: 'Compliance Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    description: 'Verifying licenses and bonds'
  },
  {
    id: 'contract_sent',
    title: 'Contracts Pending',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'Waiting for contract signatures'
  },
  {
    id: 'interview_pipeline',
    title: 'Interview Pipeline',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Operations and claims interviews'
  },
  {
    id: 'active_not_deployed',
    title: 'Ready to Deploy',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Qualified and ready for deployment'
  },
  {
    id: 'deployed',
    title: 'Deployed',
    color: 'bg-blue-900 text-blue-100 border-blue-800',
    description: 'Active in the field'
  }
];

export const PipelineView: React.FC<PipelineViewProps> = ({ applicants }) => {
  const getStageApplicants = (stageId: string) => {
    if (stageId === 'interview_pipeline') {
      return applicants.filter(a => 
        a.status.includes('interview') || 
        a.status === 'hired_inactive'
      );
    }
    return applicants.filter(a => a.status === stageId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {PIPELINE_STAGES.map(stage => {
        const stageApplicants = getStageApplicants(stage.id);
        
        return (
          <Card key={stage.id} className="pipeline-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-ocean-deep">
                  {stage.title}
                </CardTitle>
                <Badge className={`${stage.color} font-medium`}>
                  {stageApplicants.length}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {stage.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {stageApplicants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  </div>
                  <p className="text-sm">No applicants in this stage</p>
                </div>
              ) : (
                stageApplicants.map(applicant => (
                  <div key={applicant.id} className="border rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {applicant.first_name} {applicant.last_name}
                      </h4>
                      {applicant.license_state && (
                        <Badge variant="outline" className="text-xs">
                          {applicant.license_state}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {applicant.email}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {applicant.has_pa_license && (
                          <Badge className="text-xs bg-green-100 text-green-700">
                            Licensed
                          </Badge>
                        )}
                        {applicant.has_bond && (
                          <Badge className="text-xs bg-blue-100 text-blue-700">
                            Bonded
                          </Badge>
                        )}
                      </div>
                      
                      {applicant.next_action_due && (
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(applicant.next_action_due).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {applicant.specialties && applicant.specialties.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {applicant.specialties.slice(0, 2).map(specialty => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {applicant.specialties.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{applicant.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
