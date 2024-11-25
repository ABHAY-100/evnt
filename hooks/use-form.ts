import { useState } from 'react';
import { FormState } from '@/types/form';
import { csvToJson, ContactEntry } from '@/utils/csv-parser';
import { generateCSV, downloadCSV, ContactStatus } from '@/utils/report-generator';

export const useForm = () => {
  const [formState, setFormState] = useState<FormState>({
    isChannel: false,
    groupName: '',
    groupDescription: '',
    selectedFile: null,
    resetFileKey: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const handleStateChange = (key: keyof FormState, value: any) => {
    if (key === "selectedFile" && value) {
      // Validate file type
      if (!value.name.toLowerCase().endsWith('.csv')) {
        setSuccessModal({
          isOpen: true,
          title: 'Invalid File',
          message: 'Please upload a CSV file'
        });
        return;
      }
      // Validate file size (10MB)
      if (value.size > 10 * 1024 * 1024) {
        setSuccessModal({
          isOpen: true,
          title: 'File Too Large',
          message: 'File size should be less than 10MB'
        });
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
      const contacts = await csvToJson(formState.selectedFile!);

      // Pre-validate contacts
      const validatedContacts = contacts.map(contact => {
        const status: ContactStatus = {
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          status: 'Error',
          error: ''
        };

        if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
          status.error = 'No phone number provided';
          return status;
        }

        // Check for valid phone number format (+91XXXXXXXXXX)
        if (!/^\+\d{12}$/.test(contact.phoneNumber.trim())) {
          status.error = 'Invalid phone number format. Please ensure the number follows the international format (e.g., +91XXXXXXXXXX)';
          return status;
        }

        status.status = 'pending';
        delete status.error;
        return status;
      });

      // Check if all contacts have validation errors
      const allErrors = validatedContacts.every(contact => contact.status === 'Error');
      
      if (allErrors) {
        // Generate error report without creating group
        const csvContent = generateCSV(validatedContacts);
        downloadCSV(csvContent, `${formState.groupName.trim()}-report.csv`);

        setSuccessModal({
          isOpen: true,
          title: 'Process Failed',
          message: [
            'Unable to create group/channel due to errors with all contacts.',
            '',
            'Phone Number Format:',
            '• Must start with + and country code',
            '• Example: +91907494XXXX (India)',
            '',
            'Check the CSV report for details on each contact.',
          ].join('\n')
        });
        resetForm();
        return;
      }

      // Proceed with group creation only if there's at least one valid contact
      const payload = {
        type: formState.isChannel ? 'channel' : 'group',
        name: formState.groupName.trim(),
        description: formState.groupDescription.trim(),
        contacts,
      };

      // Send to API endpoint
      const response = await fetch('/api/create', {
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

      // Generate and download report
      const csvContent = generateCSV(result.contactStatuses);
      downloadCSV(csvContent, `${payload.name}-report.csv`);

      // Calculate statistics for success message
      const stats = result.contactStatuses.reduce((acc: Record<string, number>, status: ContactStatus) => {
        let statusKey = status.status;
        
        // Convert all error-like statuses to 'Error'
        if (status.status === 'validation_failed' || 
            status.status === 'error' || 
            status.status === 'pending' ||
            (status.error && status.error !== '')) {
          statusKey = 'Error';
        }
        // Convert status to proper case for counting
        else if (status.status === 'added') {
          statusKey = 'Added';
        } else if (status.status === 'invited') {
          statusKey = 'Invited';
        } else if (status.status === 'no_account') {
          statusKey = 'No Account';
        }
        
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
      }, {});

      setSuccessModal({
        isOpen: true,
        title: 'Success!',
        message: [
          `Your ${payload.type} is ready. Finally. 🎉`,
          '',
          "Here's the breakdown:",
          `• Successfully Added: ${stats.Added || 0}`,
          `• Invited via Link: ${stats.Invited || 0}`,
          `• No Account Cases: ${stats['No Account'] || 0}`,
          `• Other Errors: ${stats.Error || 0}`,
          '',
          `Group Link: ${result.inviteLink}`,
          '',
          'A detailed CSV report has been downloaded to your computer. Check it for more details.',
        ].join('\n')
      });
      
      resetForm();
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
    successModal,
    setSuccessModal,
  };
};
