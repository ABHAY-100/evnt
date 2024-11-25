export interface ContactEntry {
  name: string;
  phoneNumber: string;
  validationError?: string;
}

function validatePhoneNumber(phone: string): string | null {
  // Remove any spaces, dashes, dots, or parentheses
  const cleaned = phone.replace(/[\s\-\(\)\.]|/g, '');
  
  // Check if starts with + and has 10-15 digits
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return 'Invalid phone number format. Must have 10-15 digits';
  }

  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    return 'Phone number must start with +';
  }

  return null;
}

function validateName(name: string): string | null {
  if (!name.trim()) {
    return 'Name cannot be empty';
  }

  if (name.length > 64) {
    return 'Name is too long (max 64 characters)';
  }

  // Check for invalid characters
  if (/[<>{}\\\/]/.test(name)) {
    return 'Name contains invalid characters';
  }

  return null;
}

export const csvToJson = async (file: File): Promise<ContactEntry[]> => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error("The CSV file is empty");
    }

    const lines = text.split(/[\r\n]+/).filter(line => line.trim());
    const contacts: ContactEntry[] = [];
    let hasValidEntries = false;

    // Validate header
    const headerLine = lines[0]?.toLowerCase();
    if (!headerLine || !headerLine.includes('name') || !headerLine.includes('phone')) {
      throw new Error(
        'Invalid CSV format. First line must be a header containing "name" and "phone" or "phonenumber"'
      );
    }

    // Process each line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(val => val.trim());

      if (values.length !== 2) {
        contacts.push({
          name: line,
          phoneNumber: '',
          validationError: `Invalid line format. Expected 2 columns (name,phone) but found ${values.length}`
        });
        continue;
      }

      const [name, phoneNumber] = values;
      const contact: ContactEntry = { name, phoneNumber };

      // Validate name
      const nameError = validateName(name);
      if (nameError) {
        contact.validationError = nameError;
        contacts.push(contact);
        continue;
      }

      // Validate phone number
      const phoneError = validatePhoneNumber(phoneNumber);
      if (phoneError) {
        contact.validationError = phoneError;
        contacts.push(contact);
        continue;
      }

      // If we reach here, the entry is valid
      hasValidEntries = true;
      contacts.push(contact);
    }

    if (!hasValidEntries) {
      throw new Error(
        'No valid entries found in the CSV file. Please check the format and try again.'
      );
    }

    console.log("Processed contacts:", contacts);
    return contacts;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Failed to parse CSV file. Please ensure it follows the format: name,phone"
    );
  }
};
