'use client';
import { useState } from 'react';
import { Steps } from '@/components/events/Steps';
import { BasicInfoForm } from '@/components/events/BasicInfoForm';
import { DetailsForm } from '@/components/events/DetailsForm';
import { RulesLinksForm } from '@/components/events/RulesLinksForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (finalData: any) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...finalData })
      });

      if (!response.ok) throw new Error('Failed to create event');

      const event = await response.json();
      toast.success('Event created successfully!');
      router.push(`/events/${event.id}`);
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen pb-20">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      
      <Steps currentStep={step} />
      
      <div className="mt-8 relative">
        {step === 1 && <BasicInfoForm onNext={updateFormData} />}
        {step === 2 && <DetailsForm onNext={updateFormData} onBack={() => setStep(1)} />}
        {step === 3 && (
          <RulesLinksForm 
            onNext={handleSubmit} 
            onBack={() => setStep(2)} 
            initialData={formData} 
          />
        )}
      </div>
    </div>
  );
}
