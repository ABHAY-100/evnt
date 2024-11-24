import { useState } from 'react';
import { FormState } from '@/types/form';
import { csvToJson } from '@/utils/csv-parser';

export const useForm = () => {
  const [formState, setFormState] = useState<FormState>({
    isChannel: false,
    groupName: '',
    groupDescription: '',
    selectedFile: null,
    resetFileKey: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleStateChange = (key: keyof FormState, value: any) => {
    if (key === "selectedFile" && value) {
      // Validate file type
      if (!value.name.toLowerCase().endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
      }
      // Validate file size (10MB)
      if (value.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
    }

    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setFormState((prev) => ({
      isChannel: false,
      groupName: '',
      groupDescription: '',
      selectedFile: null,
      resetFileKey: prev.resetFileKey ? prev.resetFileKey + 1 : 1,
    }));
  };

  const validateForm = () => {
    if (!formState.groupName.trim()) {
      throw new Error('Please enter a name');
    }
    if (!formState.selectedFile) {
      throw new Error('Please upload a CSV file');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      validateForm();
      const members = await csvToJson(formState.selectedFile!);

      const payload = {
        type: formState.isChannel ? 'channel' : 'group',
        name: formState.groupName.trim(),
        description: formState.groupDescription.trim(),
        members,
      };

      // Send to API endpoint
      const response = await fetch('/api/create-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create group');
      }

      alert(`Successfully created ${payload.type}!\nInvite Link: ${result.inviteLink}`);
      resetForm();
      
      return result;
    } catch (error) {
      console.error('Error processing form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    isLoading,
    handleStateChange,
    handleSubmit,
  };
};
