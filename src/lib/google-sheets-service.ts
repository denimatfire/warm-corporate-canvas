import { Article } from './articles-api';

// Google Sheets configuration from environment variables
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;
const SHEET_NAME = 'Articles';

// Service Account Configuration from environment variables
let SERVICE_ACCOUNT_EMAIL: string;
let PRIVATE_KEY: string;

// Initialize credentials from environment
const initializeCredentials = () => {
  try {
    const credentialsStr = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    if (!credentialsStr) {
      throw new Error('VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set');
    }

    const credentials = JSON.parse(credentialsStr);
    SERVICE_ACCOUNT_EMAIL = credentials.client_email;
    PRIVATE_KEY = credentials.private_key;

    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      throw new Error('Invalid credentials format: missing client_email or private_key');
    }

    console.log('✅ Service account credentials loaded from environment variables');
    console.log('📧 Service account email:', SERVICE_ACCOUNT_EMAIL);
    console.log('🔑 Private key loaded (length):', PRIVATE_KEY.length);
  } catch (error) {
    console.error('❌ Failed to initialize credentials:', error);
    throw new Error('Failed to initialize Google Sheets credentials. Please check your environment variables.');
  }
};

// Initialize credentials on module load
initializeCredentials();

// Validate configuration
const validateConfiguration = () => {
  if (!SPREADSHEET_ID) {
    throw new Error('VITE_GOOGLE_SHEETS_ID environment variable is not set');
  }
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Service account credentials not properly initialized');
  }
  console.log('✅ Google Sheets configuration validated');
  console.log('📊 Spreadsheet ID:', SPREADSHEET_ID);
  console.log('📋 Sheet Name:', SHEET_NAME);
};

// Validate configuration on module load
validateConfiguration();

// JWT token generation for service account
let jwtToken: string | null = null;
let tokenExpiry: number | null = null;

// Generate JWT token for service account
const generateJWT = async (): Promise<string> => {
  try {
    // Check if we have a valid token
    if (jwtToken && tokenExpiry && Date.now() < tokenExpiry) {
      console.log('✅ Using existing valid JWT token');
      return jwtToken;
    }

    console.log('🔐 Generating new JWT token for service account...');
    console.log('📧 Service account email:', SERVICE_ACCOUNT_EMAIL);
    
    // Create JWT header and payload
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600, // 1 hour
      iat: now
    };
    
    console.log('📋 JWT header:', header);
    console.log('📋 JWT payload:', payload);
    
    // Encode header and payload
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    console.log('🔤 Encoded header:', encodedHeader);
    console.log('🔤 Encoded payload:', encodedPayload);
    
    // Create signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    console.log('✍️ Signature input:', signatureInput);
    
    const signature = await signWithPrivateKey(signatureInput, PRIVATE_KEY);
    console.log('🔏 Generated signature:', signature);
    
    // Combine to form JWT
    jwtToken = `${signatureInput}.${signature}`;
    tokenExpiry = Date.now() + (3600 * 1000); // 1 hour
    
    console.log('✅ JWT token generated successfully');
    console.log('🔑 Full JWT token:', jwtToken);
    return jwtToken;
  } catch (error) {
    console.error('❌ Failed to generate JWT token:', error);
    throw error;
  }
};

// Sign data with private key using Web Crypto API
const signWithPrivateKey = async (data: string, privateKeyPem: string): Promise<string> => {
  try {
    console.log('🔐 Signing JWT with Web Crypto API...');
    
    // Check if Web Crypto API is available
    if (!crypto || !crypto.subtle) {
      throw new Error('Web Crypto API not available in this environment');
    }
    
    // Convert PEM private key to CryptoKey
    const privateKey = await importPrivateKey(privateKeyPem);
    
    // Convert data to ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    console.log('📏 Data to sign length:', dataBuffer.length, 'bytes');
    
    // Sign the data
    const signature = await crypto.subtle.sign(
      { name: 'RSASSA-PKCS1-v1_5' },
      privateKey,
      dataBuffer
    );
    
    // Convert signature to base64url
    const signatureArray = new Uint8Array(signature);
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
    const signatureBase64Url = signatureBase64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    console.log('✅ JWT signature created successfully');
    console.log('🔏 Signature length:', signatureArray.length, 'bytes');
    console.log('🔏 Signature (first 50 chars):', signatureBase64Url.substring(0, 50) + '...');
    
    return signatureBase64Url;
  } catch (error) {
    console.error('❌ Failed to sign JWT with Web Crypto API:', error);
    
    // Provide helpful error information
    if (error instanceof Error) {
      if (error.message.includes('Web Crypto API not available')) {
        console.error('💡 This error occurs when running in an environment without Web Crypto API support');
        console.error('💡 Try running in a modern browser with HTTPS or localhost');
      } else if (error.message.includes('Invalid PEM format')) {
        console.error('💡 Check that your private key is in the correct PEM format');
        console.error('💡 It should start with "-----BEGIN PRIVATE KEY-----"');
      } else if (error.message.includes('importKey')) {
        console.error('💡 The private key format might be incorrect or corrupted');
        console.error('💡 Verify the key is a valid PKCS#8 RSA private key');
      }
    }
    
    throw error;
  }
};

// Import PEM private key as CryptoKey
const importPrivateKey = async (pemKey: string): Promise<CryptoKey> => {
  try {
    console.log('🔑 Importing private key...');
    
    // Remove PEM headers and convert to base64
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    
    if (!pemKey.includes(pemHeader) || !pemKey.includes(pemFooter)) {
      throw new Error('Invalid PEM format: Missing BEGIN/END PRIVATE KEY markers');
    }
    
    const base64Key = pemKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');
    
    console.log('📏 Base64 key length:', base64Key.length, 'characters');
    
    // Validate base64 format
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Key)) {
      throw new Error('Invalid base64 format in private key');
    }
    
    // Convert base64 to ArrayBuffer
    const binaryString = atob(base64Key);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('📏 Binary key length:', bytes.length, 'bytes');
    
    // Basic validation that this looks like a PKCS#8 key
    if (bytes.length < 100) {
      throw new Error('Private key seems too short for a valid RSA key');
    }
    
    // Import as CryptoKey
    console.log('🔄 Converting to CryptoKey...');
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      bytes,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );
    
    console.log('✅ Private key imported successfully');
    return cryptoKey;
  } catch (error) {
    console.error('❌ Failed to import private key:', error);
    
    // Provide specific error guidance
    if (error instanceof Error) {
      if (error.message.includes('Invalid PEM format')) {
        console.error('💡 PEM format issues:');
        console.error('   - Ensure the key starts with "-----BEGIN PRIVATE KEY-----"');
        console.error('   - Ensure the key ends with "-----END PRIVATE KEY-----"');
        console.error('   - Check for extra whitespace or line breaks');
      } else if (error.message.includes('base64')) {
        console.error('💡 Base64 format issues:');
        console.error('   - The key content should only contain A-Z, a-z, 0-9, +, /, and =');
        console.error('   - Check for invalid characters or corruption');
      } else if (error.message.includes('too short')) {
        console.error('💡 Key length issues:');
        console.error('   - RSA private keys are typically several hundred bytes long');
        console.error('   - The provided key appears to be truncated');
      } else if (error.message.includes('importKey')) {
        console.error('💡 Key format issues:');
        console.error('   - The key might not be in PKCS#8 format');
        console.error('   - Try regenerating the service account key');
      }
    }
    
    throw error;
  }
};

// Get access token using service account
const getAccessToken = async (): Promise<string> => {
  try {
    console.log('🔄 Getting access token from Google OAuth...');
    
    const jwt = await generateJWT();
    console.log('🔑 Using JWT token (first 50 chars):', jwt.substring(0, 50) + '...');
    
    // Exchange JWT for access token
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const requestBody = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    });
    
    console.log('📤 Sending token request to:', tokenUrl);
    console.log('📤 Request body:', requestBody.toString());
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Token exchange failed:', response.status, errorText);
      
      // Try to parse error response as JSON for better debugging
      try {
        const errorJson = JSON.parse(errorText);
        console.error('📋 Error details:', errorJson);
        
        if (errorJson.error === 'invalid_grant' && errorJson.error_description === 'Invalid JWT Signature.') {
          console.error('🔍 JWT signature validation failed. This usually means:');
          console.error('   - Private key format is incorrect');
          console.error('   - Private key doesn\'t match the service account');
          console.error('   - JWT algorithm or encoding issues');
        }
      } catch (parseError) {
        console.error('⚠️ Could not parse error response as JSON');
      }
      
      throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Token exchange successful:', {
      access_token: data.access_token ? `${data.access_token.substring(0, 20)}...` : 'undefined',
      expires_in: data.expires_in,
      token_type: data.token_type
    });
    
    return data.access_token;
  } catch (error) {
    console.error('❌ Failed to get access token:', error);
    throw error;
  }
};

// Get all articles from Google Sheets
export const getAllArticlesFromDrive = async (): Promise<Article[]> => {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Missing Google Sheets configuration');
    }

    console.log('📊 Fetching articles from Google Sheets...');
    
    // Get access token using service account
    const token = await getAccessToken();
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Articles!A:L`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    if (rows.length === 0) {
      console.log('📝 No articles found in Google Sheets');
      return [];
    }

    // Skip header row and convert to Article objects
    const articles: Article[] = rows.slice(1).map((row: any[], index: number) => ({
      id: row[0] || `article-${index + 1}`,
      title: row[1] || '',
      content: row[2] || '',
      excerpt: row[3] || '',
      coverImage: row[4] || '',
      tags: row[5] ? row[5].split(',').map((tag: string) => tag.trim()) : [],
      status: row[6] || 'draft',
      author: row[7] || 'Unknown',
      readTime: parseInt(row[8]) || 5,
      publishedAt: row[9] || '',
      createdAt: row[10] || new Date().toISOString(),
      updatedAt: row[11] || new Date().toISOString(),
    }));

    console.log(`✅ Successfully fetched ${articles.length} articles from Google Sheets`);
    return articles;
  } catch (error) {
    console.error('❌ Error fetching articles from Google Sheets:', error);
    
    // Fallback to localStorage
    console.log('📱 Falling back to localStorage...');
    const storedArticles = localStorage.getItem('articles');
    if (storedArticles) {
      return JSON.parse(storedArticles);
    }
    
    return [];
  }
};

// Add new article to Google Sheets
export const addArticleToDrive = async (newArticle: Omit<Article, 'id'>): Promise<Article> => {
  // Generate ID for the new article
  const articleWithId: Article = {
    ...newArticle,
    id: Date.now().toString(),
  };

  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Missing Google Sheets configuration');
    }

    console.log('📝 Adding article to Google Sheets:', articleWithId.title);
    console.log('📊 Spreadsheet ID:', SPREADSHEET_ID);
    console.log('📋 Article data:', articleWithId);
    
    // Create row data for Google Sheets
    const row = [
      articleWithId.id,
      articleWithId.title,
      articleWithId.content,
      articleWithId.excerpt,
      articleWithId.coverImage,
      articleWithId.tags.join(', '),
      articleWithId.status,
      articleWithId.author,
      articleWithId.readTime,
      articleWithId.publishedAt,
      articleWithId.createdAt,
      articleWithId.updatedAt,
    ];

    console.log('📊 Row data to append:', row);
    console.log('📊 Row data length:', row.length);

    // Get access token using service account
    const token = await getAccessToken();
    console.log('🔑 Got access token for article addition');
    
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Articles!A:L:append?valueInputOption=RAW`;
    console.log('📤 Append URL:', appendUrl);
    
    const requestBody = {
      values: [row],
    };
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Article added to Google Sheets via service account:', articleWithId.title);
      console.log('📊 Sheets API response:', result);
      
      // Log the updated range information
      if (result.updates) {
        console.log('📊 Updated range:', result.updates.updatedRange);
        console.log('📊 Updated rows:', result.updates.updatedRows);
        console.log('📊 Updated columns:', result.updates.updatedColumns);
      }
      
      return articleWithId;
    } else {
      const errorText = await response.text();
      console.warn('⚠️ Service account method failed:', response.status, errorText);
      
      // Try to parse error response for better debugging
      try {
        const errorJson = JSON.parse(errorText);
        console.error('📋 Error details:', errorJson);
      } catch (parseError) {
        console.error('⚠️ Could not parse error response as JSON');
      }
      
      throw new Error(`Failed to add article: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error adding article:', error);
    
    // Fallback to localStorage
    console.log('📱 Using localStorage fallback for article:', articleWithId.title);
    const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    existingArticles.push(articleWithId);
    localStorage.setItem('articles', JSON.stringify(existingArticles));
    
    return articleWithId;
  }
};

// Update existing article in Google Sheets
export const updateArticleInDrive = async (id: string, updates: Partial<Article>): Promise<Article | null> => {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Missing Google Sheets configuration');
    }

    console.log('📝 Updating article in Google Sheets:', id);
    
    // For now, we'll use localStorage since updating specific rows in Google Sheets via API requires more complex logic
    console.log('📝 Using localStorage for update (Google Sheets row update not implemented)');
    
    // Fallback to localStorage for now
    const storedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    const articleIndex = storedArticles.findIndex((article: Article) => article.id === id);
    
    if (articleIndex !== -1) {
      storedArticles[articleIndex] = { ...storedArticles[articleIndex], ...updates };
      localStorage.setItem('articles', JSON.stringify(storedArticles));
      return storedArticles[articleIndex];
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error updating article:', error);
    throw new Error('Failed to update article');
  }
};

// Delete article from Google Sheets
export const deleteArticleFromDrive = async (id: string): Promise<boolean> => {
  try {
    if (!SPREADSHEET_ID) {
      throw new Error('Missing Google Sheets configuration');
    }

    console.log('🗑️ Deleting article from Google Sheets:', id);
    
    // For now, we'll use localStorage since deleting specific rows in Google Sheets via API requires more complex logic
    console.log('🗑️ Using localStorage for delete (Google Sheets row deletion not implemented)');
    
    // Fallback to localStorage for now
    const storedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    const filteredArticles = storedArticles.filter((article: Article) => article.id !== id);
    
    if (filteredArticles.length !== storedArticles.length) {
      localStorage.setItem('articles', JSON.stringify(filteredArticles));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
};

// Check authentication status
export const isAuthenticated = (): boolean => {
  return !!(jwtToken && tokenExpiry && Date.now() < tokenExpiry);
};

// Get authentication status
export const getAuthStatus = (): { isAuthenticated: boolean; message: string; tokenExpiry: string | null } => {
  return {
    isAuthenticated: isAuthenticated(),
    message: isAuthenticated() ? 'Service account authenticated' : 'Not authenticated',
    tokenExpiry: tokenExpiry ? new Date(tokenExpiry).toISOString() : null
  };
};

// Redirect to authentication (not needed for service account)
export const redirectToAuth = (): void => {
  console.log('ℹ️ Service account authentication - no redirect needed');
  // Try to generate a new token
  generateJWT().catch(console.error);
};

// Clear authentication
export const clearAuth = (): void => {
  console.log('🚪 Clearing service account authentication...');
  jwtToken = null;
  tokenExpiry = null;
};

// Verify current Google Sheet state
export const verifyGoogleSheetState = async (): Promise<void> => {
  try {
    console.log('🔍 Verifying Google Sheet state...');
    console.log('📊 Spreadsheet ID:', SPREADSHEET_ID);
    
    // Get access token
    const token = await getAccessToken();
    
    // Get current sheet data
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Articles!A:L`;
    console.log('📤 Fetching sheet data from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];
    
    console.log('📊 Sheet verification results:');
    console.log('📊 Total rows in sheet:', rows.length);
    console.log('📊 Header row:', rows[0] || 'No header row found');
    
    if (rows.length > 1) {
      console.log('📊 Data rows:');
      rows.slice(1).forEach((row: any[], index: number) => {
        console.log(`  Row ${index + 1}: [${row.join(', ')}]`);
      });
    } else {
      console.log('📊 No data rows found (only header)');
    }
    
    // Check sheet metadata
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
    const metadataResponse = await fetch(metadataUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json();
      console.log('📊 Sheet metadata:');
      console.log('📊 Sheet title:', metadata.properties?.title);
      console.log('📊 Sheet ID:', metadata.spreadsheetId);
      console.log('📊 Available sheets:', metadata.sheets?.map((s: any) => s.properties?.title) || []);
    }
    
  } catch (error) {
    console.error('❌ Error verifying Google Sheet state:', error);
  }
};

// Convert sheet row to Article object
const rowToArticle = (row: any[]): Article => {
  return {
    id: row[0] || '',
    title: row[1] || '',
    content: row[2] || '',
    excerpt: row[3] || '',
    coverImage: row[4] || '',
    tags: row[5] ? row[5].split(',').map((tag: string) => tag.trim()) : [],
    status: row[6] || 'draft',
    author: row[7] || 'Unknown',
    readTime: parseInt(row[8]) || 5,
    publishedAt: row[9] || '',
    createdAt: row[10] || new Date().toISOString(),
    updatedAt: row[11] || new Date().toISOString(),
  };
};

// Convert Article object to sheet row
const articleToRow = (article: Article): any[] => {
  return [
    article.id,
    article.title,
    article.content,
    article.excerpt,
    article.coverImage,
    article.tags.join(', '),
    article.status,
    article.author,
    article.readTime,
    article.publishedAt,
    article.createdAt,
    article.updatedAt,
  ];
};

// Export utility functions
export { rowToArticle, articleToRow };
