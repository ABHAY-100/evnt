export interface ContactStatus {
  name: string;
  phoneNumber: string;
  status: 'Added' | 'Invited' | 'No Account' | 'Error' | 'error' | 'added' | 'invited' | 'no_account' | 'validation_failed' | 'pending';
  inviteLink?: string;
  error?: string;
}

export const generateCSV = (contacts: ContactStatus[]): string => {
  const headers = ['Name', 'Phone Number', 'Status', 'Details'];
  const rows = contacts.map(contact => {
    let status = contact.status;
    let details = contact.error || '';

    // Convert status to proper format
    if (status === 'validation_failed' || 
        status === 'error' || 
        status === 'pending' ||
        (contact.error && contact.error !== '')) {
      status = 'Error';
    } else if (status === 'added') {
      status = 'Added';
    } else if (status === 'invited') {
      status = 'Invited';
    } else if (status === 'no_account') {
      status = 'No Account';
    }

    // Handle validation failures
    if (!contact.phoneNumber || contact.phoneNumber.trim() === '') {
      status = 'Error';
      details = 'No phone number provided';
    } else {
      const phoneNumber = contact.phoneNumber.trim();
      // Check for international format: +[country code][number]
      // Country codes can be 1-4 digits, local numbers typically 7-15 digits
      if (!/^\+\d{1,4}\d{7,15}$/.test(phoneNumber)) {
        status = 'Error';
        details = 'Invalid phone number format. Please ensure the number follows the international format (e.g., +[country code][number])';
      } else {
        // Additional validation for specific country codes
        const countryCode = phoneNumber.match(/^\+(\d{1,4})/)?.[1];
        const localNumber = phoneNumber.slice(countryCode!.length + 1);
        
        if (countryCode === '91' && localNumber.length !== 10) {
          // India: exactly 10 digits after +91
          status = 'Error';
          details = 'Indian phone numbers must have exactly 10 digits after +91';
        } else if (countryCode === '1' && localNumber.length !== 10) {
          // US/Canada: exactly 10 digits after +1
          status = 'Error';
          details = 'US/Canada phone numbers must have exactly 10 digits after +1';
        } else if (countryCode === '44' && (localNumber.length < 9 || localNumber.length > 10)) {
          // UK: 9-10 digits after +44
          status = 'Error';
          details = 'UK phone numbers must have 9-10 digits after +44';
        } else if (countryCode === '86' && (localNumber.length < 11 || localNumber.length > 12)) {
          // China: 11-12 digits after +86
          status = 'Error';
          details = 'Chinese phone numbers must have 11-12 digits after +86';
        }
        // Add more country-specific validations as needed
      }
    }
    
    return [
      contact.name,
      contact.phoneNumber || '',
      status,
      details
    ];
  });

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      // Escape any commas in the cell content
      const escaped = cell.toString().replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(','))
  ].join('\n');
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
