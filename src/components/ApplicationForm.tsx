
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Shield, FileText, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  has_pa_license: boolean;
  license_number: string;
  license_state: string;
  license_expiry: string;
  has_bond: boolean;
  bond_number: string;
  bond_amount: string;
  bond_expiry: string;
  specialties: string[];
  source: string;
  notes: string;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const SPECIALTIES = [
  'Wind Damage', 'Flood Damage', 'Fire Damage', 'Hail Damage',
  'Commercial Property', 'Residential Property', 'Contents Claims',
  'Business Interruption', 'Liability Claims', 'Auto Claims'
];

const LEAD_SOURCES = [
  'Website', 'Referral', 'LinkedIn', 'Indeed', 'Industry Event',
  'Direct Contact', 'Other'
];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    has_pa_license: false,
    license_number: '',
    license_state: '',
    license_expiry: '',
    has_bond: false,
    bond_number: '',
    bond_amount: '',
    bond_expiry: '',
    specialties: [],
    source: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.email && formData.phone;
      case 2:
        return formData.address && formData.city && formData.state && formData.zip;
      case 3:
        if (!formData.has_pa_license) return true;
        return formData.license_number && formData.license_state && formData.license_expiry;
      case 4:
        if (!formData.has_bond) return true;
        return formData.bond_number && formData.bond_amount && formData.bond_expiry;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const submissionData = {
        ...formData,
        status: formData.has_pa_license && formData.has_bond 
          ? 'compliance_verification' 
          : 'other_roles_review',
        created_at: new Date().toISOString()
      };

      onSubmit(submissionData);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'PA License', icon: Shield },
    { number: 4, title: 'Bond Info', icon: FileText },
    { number: 5, title: 'Specialties', icon: User }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto animate-slide-up">
        <CardHeader className="ocean-gradient text-white relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">CAN Application Form</CardTitle>
          <CardDescription className="text-blue-100">
            Step {currentStep} of 5 - {steps[currentStep - 1]?.title}
          </CardDescription>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-2 mt-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.number <= currentStep
                      ? 'bg-white text-ocean-primary'
                      : 'bg-ocean-primary/30 text-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  placeholder="12345"
                  maxLength={5}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_pa_license"
                  checked={formData.has_pa_license}
                  onCheckedChange={(checked) => handleInputChange('has_pa_license', checked)}
                />
                <Label htmlFor="has_pa_license" className="text-sm font-medium">
                  I have a valid Public Adjuster license
                </Label>
              </div>

              {formData.has_pa_license && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label htmlFor="license_number">License Number *</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => handleInputChange('license_number', e.target.value)}
                      placeholder="Enter license number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="license_state">License State *</Label>
                      <Select value={formData.license_state} onValueChange={(value) => handleInputChange('license_state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="license_expiry">Expiry Date *</Label>
                      <Input
                        id="license_expiry"
                        type="date"
                        value={formData.license_expiry}
                        onChange={(e) => handleInputChange('license_expiry', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_bond"
                  checked={formData.has_bond}
                  onCheckedChange={(checked) => handleInputChange('has_bond', checked)}
                />
                <Label htmlFor="has_bond" className="text-sm font-medium">
                  I have a valid surety bond
                </Label>
              </div>

              {formData.has_bond && (
                <div className="space-y-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <div>
                    <Label htmlFor="bond_number">Bond Number *</Label>
                    <Input
                      id="bond_number"
                      value={formData.bond_number}
                      onChange={(e) => handleInputChange('bond_number', e.target.value)}
                      placeholder="Enter bond number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bond_amount">Bond Amount *</Label>
                      <Input
                        id="bond_amount"
                        type="number"
                        value={formData.bond_amount}
                        onChange={(e) => handleInputChange('bond_amount', e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bond_expiry">Expiry Date *</Label>
                      <Input
                        id="bond_expiry"
                        type="date"
                        value={formData.bond_expiry}
                        onChange={(e) => handleInputChange('bond_expiry', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Areas of Expertise (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALTIES.map(specialty => (
                    <div
                      key={specialty}
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.specialties.includes(specialty)
                          ? 'border-ocean-primary bg-blue-50 text-ocean-primary'
                          : 'border-gray-200 hover:border-ocean-primary/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{specialty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="source">How did you hear about us?</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCES.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>

        <div className="flex justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              className="ocean-gradient text-white"
              disabled={!validateStep(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ocean-gradient text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
