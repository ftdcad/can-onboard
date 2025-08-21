
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertBarProps {
  overdueCount: number;
}

export const AlertBar: React.FC<AlertBarProps> = ({ overdueCount }) => {
  if (overdueCount === 0) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          All applications are on track! No overdue actions at this time.
        </AlertDescription>
      </Alert>
    );
  }

  const getAlertSeverity = (count: number) => {
    if (count >= 5) return 'critical';
    if (count >= 3) return 'urgent';
    return 'warning';
  };

  const severity = getAlertSeverity(overdueCount);
  
  const alertClasses = {
    warning: 'alert-warning',
    urgent: 'alert-urgent',
    critical: 'alert-critical'
  };

  const icons = {
    warning: Clock,
    urgent: AlertTriangle,
    critical: AlertCircle
  };

  const Icon = icons[severity];

  return (
    <Alert className={`mb-6 ${alertClasses[severity]} animate-pulse-gentle`}>
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span>
          <strong>{overdueCount}</strong> applications need immediate attention - 
          actions are overdue and require follow-up.
        </span>
        <Button 
          variant="outline" 
          size="sm"
          className="ml-4"
          onClick={() => {
            // In real app, this would filter to overdue items
            console.log('Showing overdue items');
          }}
        >
          View Overdue
        </Button>
      </AlertDescription>
    </Alert>
  );
};

// Fix missing import
import { CheckCircle } from 'lucide-react';
