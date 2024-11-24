export const csvToJson = async (file: File): Promise<string[]> => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const text = await file.text();
    if (!text.trim()) {
      throw new Error("The CSV file is empty");
    }

    const lines = text.split(/[\r\n]+/);
    const phoneNumbers: string[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const values = line
        .replace(/['"]/g, "")
        .split(/[,;\t]/)
        .map((val) => val.trim());

      for (const val of values) {
        if (!val) continue;

        const cleaned = val.replace(/[\s\-().+]/g, "");

        if (cleaned.length >= 10 && /^\d+$/.test(cleaned)) {
          phoneNumbers.push("+" + cleaned);
        }
      }
    }

    const uniqueNumbers = Array.from(new Set(phoneNumbers)).filter(Boolean);

    if (uniqueNumbers.length === 0) {
      throw new Error(
        "No valid phone numbers found in the CSV file. Numbers should be at least 10 digits (e.g., +1234567890)"
      );
    }

    console.log("Found phone numbers:", uniqueNumbers);
    return uniqueNumbers;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Failed to parse CSV file. Please ensure it contains valid phone numbers."
    );
  }
};
