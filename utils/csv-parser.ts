export interface ContactEntry {
  name: string;
  phoneNumber: string;
  validationError?: string;
}

function validatePhoneNumber(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-\(\)\.]|/g, "");

  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return "Invalid phone number format. Must have 10-15 digits";
  }

  if (!cleaned.startsWith("+")) {
    return "Phone number must start with +";
  }

  return null;
}

function validateName(name: string): string | null {
  if (!name.trim()) {
    return "Name cannot be empty";
  }

  if (name.length > 64) {
    return "Name is too long (max 64 characters)";
  }

  if (/[<>{}\\\/]/.test(name)) {
    return "Name contains invalid characters";
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

    const lines = text.split(/[\r\n]+/).filter((line) => line.trim());
    const contacts: ContactEntry[] = [];
    let hasValidEntries = false;

    const headerLine = lines[0]?.toLowerCase();
    if (
      !headerLine ||
      !headerLine.includes("name") ||
      !headerLine.includes("phone")
    ) {
      throw new Error(
        'Invalid CSV format. First line must be a header containing "name" and "phone" or "phonenumber"'
      );
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((val) => val.trim());

      if (values.length !== 2) {
        contacts.push({
          name: line,
          phoneNumber: "",
          validationError: `Invalid line format. Expected 2 columns (name,phone) but found ${values.length}`,
        });
        continue;
      }

      const [name, phoneNumber] = values;
      const contact: ContactEntry = { name, phoneNumber };

      const nameError = validateName(name);
      if (nameError) {
        contact.validationError = nameError;
        contacts.push(contact);
        continue;
      }

      const phoneError = validatePhoneNumber(phoneNumber);
      if (phoneError) {
        contact.validationError = phoneError;
        contacts.push(contact);
        continue;
      }

      hasValidEntries = true;
      contacts.push(contact);
    }

    if (!hasValidEntries) {
      throw new Error(
        "No valid entries found in the CSV file. Please check the format and try again."
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
