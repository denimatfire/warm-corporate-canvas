export const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxDlfVlK2tke2zNyPQwL9f2owyruYrPgGvoBDqTYMUm1_8C5jiQy4bHd2UnmEHSefnSaw/exec"; // TODO: paste your deployed Apps Script Web App URL here

export type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

/**
 * Sends the contact form data to a Google Apps Script Web App endpoint that appends
 * the data to a Google Sheet. The Apps Script must handle CORS and return JSON.
 */
export const logContactToSheet = async (
	formData: ContactFormData
): Promise<{ ok: boolean; error?: string }> => {
	if (!SHEETS_WEB_APP_URL) {
		console.warn("SHEETS_WEB_APP_URL is not configured; skipping Sheets logging.");
		return { ok: true };
	}

	try {
		const payload = {
			name: formData.name,
			email: formData.email,
			message: formData.message,
			timestamp: new Date().toISOString(),
		};

		const response = await fetch(SHEETS_WEB_APP_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Sheets logging failed (${response.status}): ${text}`);
		}

		return { ok: true };
	} catch (error: any) {
		console.error("Failed to log to Google Sheets:", error);
		return { ok: false, error: String(error?.message || error) };
	}
};
