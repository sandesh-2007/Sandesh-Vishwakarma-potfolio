import { getAccessToken } from './googleAuth';
import { ContactMessage } from '../types';

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: { title: string; sheetId: number }[];
  spreadsheetUrl: string;
}

export interface ContactRowData {
  timestamp: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  id?: string;
}

/**
 * Creates a brand new Google Spreadsheet in the authenticated user's Google Drive
 * titled "Sandesh Portfolio - Contact Submissions" with pre-styled headers.
 */
export async function createPortfolioSpreadsheet(tokenOverride?: string): Promise<{
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetName: string;
}> {
  const token = tokenOverride || (await getAccessToken());
  if (!token) {
    throw new Error('Google authentication required to create spreadsheet. Please sign in with Google.');
  }

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'Sandesh Portfolio - Contact Submissions',
      },
      sheets: [
        {
          properties: {
            title: 'Contact Messages',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create Google Spreadsheet (${response.status})`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const sheetName = 'Contact Messages';
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Insert standard Header Row
  await initializeSheetHeaders(spreadsheetId, sheetName, token);

  return {
    spreadsheetId,
    spreadsheetUrl,
    sheetName,
  };
}

/**
 * Adds the standard column headers to the target sheet
 */
export async function initializeSheetHeaders(
  spreadsheetId: string,
  sheetName: string,
  token: string
): Promise<void> {
  const headers = [
    'Timestamp',
    'Full Name',
    'Email Address',
    'Subject',
    'Message Details',
    'Message ID',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      sheetName
    )}!A1:F1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headers],
      }),
    }
  );
}

/**
 * Validates access to an existing spreadsheet and gets its available sheet names
 */
export async function getSpreadsheetDetails(
  spreadsheetId: string,
  tokenOverride?: string
): Promise<SheetMetadata> {
  const token = tokenOverride || (await getAccessToken());
  if (!token) {
    throw new Error('Google authorization token not available. Please sign in with Google.');
  }

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=false`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to access spreadsheet with ID ${spreadsheetId}`);
  }

  const data = await res.json();
  const sheets = (data.sheets || []).map((s: any) => ({
    title: s.properties?.title || 'Sheet1',
    sheetId: s.properties?.sheetId || 0,
  }));

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Untitled Spreadsheet',
    sheets,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * Appends a single contact submission row to the target Google Sheet
 */
export async function appendContactToSheet(
  spreadsheetId: string,
  sheetName: string,
  contact: ContactRowData,
  tokenOverride?: string
): Promise<{ success: boolean; updatedRange?: string }> {
  const token = tokenOverride || (await getAccessToken());
  if (!token) {
    throw new Error('Google authorization token required to append to Google Sheets.');
  }

  const row = [
    contact.timestamp || new Date().toLocaleString(),
    contact.name,
    contact.email,
    contact.subject || 'Portfolio Inquiry',
    contact.message,
    contact.id || 'msg-' + Date.now(),
  ];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    sheetName
  )}!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to append contact row to Google Sheet (${res.status})`);
  }

  const resData = await res.json();
  return {
    success: true,
    updatedRange: resData.updates?.updatedRange,
  };
}

/**
 * Appends multiple messages (batch sync) to the Google Sheet
 */
export async function batchAppendMessagesToSheet(
  spreadsheetId: string,
  sheetName: string,
  messages: ContactMessage[],
  tokenOverride?: string
): Promise<{ success: boolean; count: number }> {
  if (messages.length === 0) {
    return { success: true, count: 0 };
  }

  const token = tokenOverride || (await getAccessToken());
  if (!token) {
    throw new Error('Google authorization token required to sync with Google Sheet.');
  }

  const rows = messages.map((m) => [
    new Date(m.timestamp).toLocaleString(),
    m.name,
    m.email,
    m.subject || 'Portfolio Inquiry',
    m.message,
    m.id,
  ]);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    sheetName
  )}!A:F:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: rows,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to batch sync messages to Google Sheet (${res.status})`);
  }

  return { success: true, count: messages.length };
}

/**
 * Helper to extract spreadsheet ID from either a raw ID or full Google Sheets URL
 */
export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}
