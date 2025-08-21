
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  FileText, 
  Clock, 
  Calendar,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

interface ApplicantCardProps {
  applicant: Applicant;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant }) => {
  const getStatusInfo = (status: string) => {
    const statusMap = {
      'application_submitted': {
        label: 'Application Submitted',
        color: 'status-submitted',
        icon: FileText
      },
      'other_roles_review': {
        label: 'Other Roles Review',
        color: 'status-review',
        icon: User
      },
      'compliance_verification': {
        label: 'Compliance Verification',
        color: 'status-review',
        icon: Shield
      },
      'hr_contract_pending': {
        label: 'HR Contract Pending',
        color: 'status-contract',
        icon: FileText
      },
      'contract_sent': {
        label: 'Contract Sent',
        color: 'status-contract',
        icon: FileText
      },
      'hired_inactive': {
        label: 'Hired (Inactive)',
        color: 'status-verified',
        icon: CheckCircle
      },
      'ops_interview_scheduled': {
        label: 'Ops Interview Scheduled',
        color: 'status-interview',
        icon: Calendar
      },
      'claims_interview_scheduled': {
        label: 'Claims Interview Scheduled',
        color: 'status-interview',
        icon: Calendar
      },
      'active_not_deployed': {
        label: 'Active - Not Deployed',
        color: 'status-active',
        icon: CheckCircle
      },
      'deployed': {
        label: 'Deployed',
        color: 'status-deployed',
        icon: CheckCircle
      },
      'rejected': {
        label: 'Rejected',
        color: 'status-rejected',
        icon: AlertTriangle
      }
    };

    return statusMap[status as keyof typeof statusMap] || {
      label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      color: 'bg-gray-100 text-gray-800',
      icon: User
    };
  };

  const statusInfo = getStatusInfo(applicant.status);
  const StatusIcon = statusInfo.icon;
  
  const isOverdue = applicant.next_action_due && new Date(applicant.next_action_due) < new Date();
  const daysSinceApplied = Math.floor(
    (new Date().getTime() - new Date(applicant.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={`pipeline-card ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-ocean-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-ocean-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-ocean-deep">
                {applicant.first_name} {applicant.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Applied {daysSinceApplied} days ago
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Application</DropdownMenuItem>
              <DropdownMenuItem>Change Status</DropdownMenuItem>
              <DropdownMenuItem>Add Note</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={statusInfo.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusInfo.label}
          </Badge>
          {isOverdue && (
            <Badge className="status-rejected animate-pulse-gentle">
              <Clock className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{applicant.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{applicant.phone}</span>
          </div>
          {applicant.license_state && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Licensed in {applicant.license_state}</span>
            </div>
          )}
        </div>

        {/* Credentials */}
        <div className="flex space-x-2 mb-4">
          {applicant.has_pa_license && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Licensed PA
            </Badge>
          )}
          {applicant.has_bond && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <FileText className="w-3 h-3 mr-1" />
              Bonded
            </Badge>
          )}
        </div>

        {/* Specialties */}
        {applicant.specialties && applicant.specialties.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Specialties</p>
            <div className="flex flex-wrap gap-1">
              {applicant.specialties.slice(0, 3).map(specialty => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {applicant.specialties.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{applicant.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Due Date */}
        {applicant.next_action_due && (
          <div className={`flex items-center space-x-2 text-sm p-2 rounded ${
            isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              Action due: {new Date(applicant.next_action_due).toLocaleDateString()}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-4">
          <Button size="sm" className="flex-1">
            Update Status
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
