/**
 * Google Apps Script Backend for Article Management
 * 
 * This script provides a REST API for managing articles stored in Google Sheets.
 * It handles CRUD operations, search, and filtering for articles.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Copy this code into the editor
 * 4. Create a Google Sheet with the following columns:
 *    - A: id, B: title, C: content, D: excerpt, E: coverImage, F: tags, G: status, H: author, I: readTime, J: publishedAt, K: createdAt, L: updatedAt
 * 5. Update the SPREADSHEET_ID below with your sheet ID
 * 6. Deploy as a web app (Execute as: Me, Who has access: Anyone)
 * 7. Copy the web app URL and update your React app's ARTICLES_API_URL
 */

// Configuration - UPDATE THESE VALUES
const SPREADSHEET_ID = '1tbP-Z1RaGQ8CzsBhme44gCF1nFYZoZy7qhKvCLrjF3k'; // Get this from your Google Sheet URL
const SHEET_NAME = 'Articles'; // Name of the sheet tab

// Column mappings
const COLUMNS = {
  ID: 0,           // A
  TITLE: 1,        // B
  CONTENT: 2,      // C
  EXCERPT: 3,      // D
  COVER_IMAGE: 4,  // E
  TAGS: 5,         // F
  STATUS: 6,       // G
  AUTHOR: 7,       // H
  READ_TIME: 8,    // I
  PUBLISHED_AT: 9, // J
  CREATED_AT: 10,  // K
  UPDATED_AT: 11   // L
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Main function to handle HTTP requests
 */
function doGet(e) {
  try {
    // Handle case where function is called without parameters (testing)
    if (!e) {
      console.log('Function called without parameters - returning test response');
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Google Apps Script is working!',
        timestamp: new Date().toISOString(),
        instructions: 'Use ?action=getAll to get all articles'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate the event parameter
    if (!e.parameter) {
      console.error('Invalid request parameters:', e);
      return createErrorResponse('Invalid request parameters', 400);
    }
    
    // Parse query parameters
    const params = e.parameter;
    const action = params.action;
    
    // Validate action parameter
    if (!action) {
      return createErrorResponse('Action parameter is required. Available actions: getAll, getPublished, getById, search, getByTag, getStats', 400);
    }
    
    let result;
    
    switch (action) {
      case 'getAll':
        result = getAllArticles();
        break;
      case 'getPublished':
        result = getPublishedArticles();
        break;
      case 'getById':
        const id = params.id;
        if (!id) {
          return createErrorResponse('Article ID is required', 400);
        }
        result = getArticleById(id);
        break;
      case 'search':
        const query = params.query;
        if (!query) {
          return createErrorResponse('Search query is required', 400);
        }
        result = searchArticles(query);
        break;
      case 'getByTag':
        const tag = params.tag;
        if (!tag) {
          return createErrorResponse('Tag is required', 400);
        }
        result = getArticlesByTag(tag);
        break;
      case 'getStats':
        result = getArticleStats();
        break;
      default:
        return createErrorResponse('Invalid action specified. Available actions: getAll, getPublished, getById, search, getByTag, getStats', 400);
    }
    
    return createSuccessResponse(result);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return createErrorResponse('Internal server error: ' + error.message, 500);
  }
}

/**
 * Handle POST requests for create, update, delete operations
 */
function doPost(e) {
  try {
    // Validate the event parameter
    if (!e || !e.postData || !e.postData.contents) {
      console.error('Invalid POST request:', e);
      return createErrorResponse('Invalid POST request', 400);
    }
    
    // Parse request body
    let postData;
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.error('Error parsing POST data:', parseError);
      return createErrorResponse('Invalid JSON in request body', 400);
    }
    
    const action = postData.action;
    
    // Validate action parameter
    if (!action) {
      return createErrorResponse('Action parameter is required', 400);
    }
    
    let result;
    
    switch (action) {
      case 'create':
        const createData = postData.data;
        if (!createData) {
          return createErrorResponse('Article data is required', 400);
        }
        result = createArticle(createData);
        break;
      case 'update':
        const updateId = postData.id;
        const updateData = postData.data;
        if (!updateId || !updateData) {
          return createErrorResponse('Article ID and update data are required', 400);
        }
        result = updateArticle(updateId, updateData);
        break;
      case 'delete':
        const deleteId = postData.id;
        if (!deleteId) {
          return createErrorResponse('Article ID is required', 400);
        }
        result = deleteArticle(deleteId);
        break;
      default:
        return createErrorResponse('Invalid action specified', 400);
    }
    
    return createSuccessResponse(result);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return createErrorResponse('Internal server error: ' + error.message, 500);
  }
}

/**
 * Get all articles from the sheet
 */
function getAllArticles() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row
  const articles = data.slice(1).map(row => rowToArticle(row));
  
  // Filter out empty rows
  return articles.filter(article => article && article.id);
}

/**
 * Get only published articles
 */
function getPublishedArticles() {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.status === 'published');
}

/**
 * Get article by ID
 */
function getArticleById(id) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row and search for ID
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[COLUMNS.ID] === id) {
      return rowToArticle(row);
    }
  }
  
  return null;
}

/**
 * Create a new article
 */
function createArticle(articleData) {
  const sheet = getSheet();
  
  // Generate unique ID
  const id = generateId();
  const now = new Date().toISOString();
  
  // Prepare row data
  const rowData = [
    id,                                    // ID
    articleData.title || '',               // Title
    articleData.content || '',             // Content
    articleData.excerpt || '',             // Excerpt
    articleData.coverImage || '',          // Cover Image
    JSON.stringify(articleData.tags || []), // Tags (as JSON string)
    articleData.status || 'draft',         // Status
    articleData.author || '',              // Author
    articleData.readTime || 5,             // Read Time
    articleData.publishedAt || '',         // Published At
    now,                                   // Created At
    now                                    // Updated At
  ];
  
  // Add new row
  sheet.appendRow(rowData);
  
  // Return the created article
  return {
    ...articleData,
    id,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Update an existing article
 */
function updateArticle(id, updateData) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Find the row with the given ID
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[COLUMNS.ID] === id) {
      // Update the row
      const updatedRow = [...row];
      
      if (updateData.title !== undefined) updatedRow[COLUMNS.TITLE] = updateData.title;
      if (updateData.content !== undefined) updatedRow[COLUMNS.CONTENT] = updateData.content;
      if (updateData.excerpt !== undefined) updatedRow[COLUMNS.EXCERPT] = updateData.excerpt;
      if (updateData.coverImage !== undefined) updatedRow[COLUMNS.COVER_IMAGE] = updateData.coverImage;
      if (updateData.tags !== undefined) updatedRow[COLUMNS.TAGS] = JSON.stringify(updateData.tags);
      if (updateData.status !== undefined) updatedRow[COLUMNS.STATUS] = updateData.status;
      if (updateData.author !== undefined) updatedRow[COLUMNS.AUTHOR] = updateData.author;
      if (updateData.readTime !== undefined) updatedRow[COLUMNS.READ_TIME] = updateData.readTime;
      if (updateData.publishedAt !== undefined) updatedRow[COLUMNS.PUBLISHED_AT] = updateData.publishedAt;
      
      updatedRow[COLUMNS.UPDATED_AT] = new Date().toISOString();
      
      // Update the row in the sheet
      const range = sheet.getRange(i + 1, 1, 1, updatedRow.length);
      range.setValues([updatedRow]);
      
      return rowToArticle(updatedRow);
    }
  }
  
  return null; // Article not found
}

/**
 * Delete an article
 */
function deleteArticle(id) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Find the row with the given ID
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[COLUMNS.ID] === id) {
      // Delete the row
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  return false; // Article not found
}

/**
 * Search articles by query
 */
function searchArticles(query) {
  const allArticles = getAllArticles();
  const lowercaseQuery = query.toLowerCase();
  
  return allArticles.filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    article.author.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get articles by tag
 */
function getArticlesByTag(tag) {
  const allArticles = getAllArticles();
  const lowercaseTag = tag.toLowerCase();
  
  return allArticles.filter(article => 
    article.tags.some(t => t.toLowerCase() === lowercaseTag)
  );
}

/**
 * Get article statistics
 */
function getArticleStats() {
  const allArticles = getAllArticles();
  const total = allArticles.length;
  const published = allArticles.filter(a => a.status === 'published').length;
  const drafts = allArticles.filter(a => a.status === 'draft').length;
  
  // Count unique tags
  const allTags = allArticles.flatMap(a => a.tags);
  const uniqueTags = new Set(allTags);
  const totalTags = uniqueTags.size;
  
  return { total, published, drafts, totalTags };
}

/**
 * Convert sheet row to article object
 */
function rowToArticle(row) {
  try {
    return {
      id: row[COLUMNS.ID] || '',
      title: row[COLUMNS.TITLE] || '',
      content: row[COLUMNS.CONTENT] || '',
      excerpt: row[COLUMNS.EXCERPT] || '',
      coverImage: row[COLUMNS.COVER_IMAGE] || '',
      tags: parseTags(row[COLUMNS.TAGS]),
      status: row[COLUMNS.STATUS] || 'draft',
      author: row[COLUMNS.AUTHOR] || '',
      readTime: parseInt(row[COLUMNS.READ_TIME]) || 5,
      publishedAt: row[COLUMNS.PUBLISHED_AT] || '',
      createdAt: row[COLUMNS.CREATED_AT] || '',
      updatedAt: row[COLUMNS.UPDATED_AT] || ''
    };
  } catch (error) {
    console.error('Error parsing row to article:', error, row);
    return null;
  }
}

/**
 * Parse tags from JSON string or comma-separated string
 */
function parseTags(tagsString) {
  if (!tagsString) return [];
  
  try {
    // Try to parse as JSON first
    if (tagsString.startsWith('[') && tagsString.endsWith(']')) {
      return JSON.parse(tagsString);
    }
    
    // Fallback to comma-separated
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  } catch (error) {
    // Fallback to comma-separated
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  }
}

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get the Google Sheet
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    createHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Create headers for the sheet
 */
function createHeaders(sheet) {
  const headers = [
    'ID', 'Title', 'Content', 'Excerpt', 'Cover Image', 'Tags', 
    'Status', 'Author', 'Read Time', 'Published At', 'Created At', 'Updated At'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Style headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#f3f4f6');
}

/**
 * Create success response with CORS headers
 */
function createSuccessResponse(data) {
  // Create the response data
  const responseData = {
    success: true,
    data: data
  };
  
  // Return the response - Google Apps Script web apps handle CORS automatically
  // when deployed with proper settings
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create error response with CORS headers
 */
function createErrorResponse(message, statusCode = 500) {
  // Create the response data
  const responseData = {
    success: false,
    error: message,
    statusCode: statusCode
  };
  
  // Return the response - Google Apps Script web apps handle CORS automatically
  // when deployed with proper settings
  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Simple health check function
 * Call this to verify the script is working
 */
function healthCheck() {
  try {
    const sheet = getSheet();
    const stats = getArticleStats();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      sheetAccess: 'success',
      articleCount: stats.total,
      publishedCount: stats.published,
      draftCount: stats.drafts
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the script is working
 * Call this function manually to test basic functionality
 */
function testScript() {
  try {
    console.log('Testing script functionality...');
    
    // Test basic functions
    const sheet = getSheet();
    console.log('Sheet accessed successfully');
    
    // Test getting articles
    const articles = getAllArticles();
    console.log('Articles retrieved:', articles.length);
    
    // Test getting stats
    const stats = getArticleStats();
    console.log('Stats retrieved:', stats);
    
    console.log('All tests passed!');
    return 'Script is working correctly';
    
  } catch (error) {
    console.error('Test failed:', error);
    return 'Test failed: ' + error.message;
  }
}

/**
 * Initialize the sheet with sample data (run this once manually)
 */
function initializeSampleData() {
  const sheet = getSheet();
  
  // Check if we already have data
  if (sheet.getLastRow() > 1) {
    console.log('Sheet already has data, skipping initialization');
    return;
  }
  
  const sampleArticles = [
    {
      title: 'Welcome to My Blog',
      content: '<h1>Welcome!</h1><p>This is your first article.</p>',
      excerpt: 'A warm welcome to readers',
      coverImage: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
      tags: ['Welcome', 'Introduction'],
      status: 'published',
      author: 'Your Name',
      readTime: 2
    }
  ];
  
  sampleArticles.forEach(article => {
    createArticle(article);
  });
  
  console.log('Sample data initialized');
}
