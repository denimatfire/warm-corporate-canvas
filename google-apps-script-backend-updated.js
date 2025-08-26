function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('1tbP-Z1RaGQ8CzsBhme44gCF1nFYZoZy7qhKvCLrjF3k').getSheetByName('Articles');
    const data = JSON.parse(e.postData.contents);
    
    let result;
    
    if (data.action === 'add') {
      const article = data.article;
      const row = [
        article.id,
        article.title,
        article.content,
        article.excerpt,
        article.coverImage,
        article.tags.join(', '),
        article.status,
        article.author,
        article.readTime,
        article.publishedAt || '',
        article.createdAt,
        article.updatedAt
      ];
      
      sheet.appendRow(row);
      result = { 
        success: true, 
        message: 'Article added successfully',
        articleId: article.id
      };
    }
    
    else if (data.action === 'update') {
      const id = data.id;
      const updates = data.updates;
      
      // Find the row with the matching ID
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      let found = false;
      for (let i = 1; i < values.length; i++) { // Skip header row
        if (values[i][0] === id) {
          // Update the row
          if (updates.title !== undefined) sheet.getRange(i + 1, 2).setValue(updates.title);
          if (updates.content !== undefined) sheet.getRange(i + 1, 3).setValue(updates.content);
          if (updates.excerpt !== undefined) sheet.getRange(i + 1, 4).setValue(updates.excerpt);
          if (updates.coverImage !== undefined) sheet.getRange(i + 1, 5).setValue(updates.coverImage);
          if (updates.tags !== undefined) sheet.getRange(i + 1, 6).setValue(updates.tags.join(', '));
          if (updates.status !== undefined) sheet.getRange(i + 1, 7).setValue(updates.status);
          if (updates.author !== undefined) sheet.getRange(i + 1, 8).setValue(updates.author);
          if (updates.readTime !== undefined) sheet.getRange(i + 1, 9).setValue(updates.readTime);
          if (updates.publishedAt !== undefined) sheet.getRange(i + 1, 10).setValue(updates.publishedAt);
          if (updates.updatedAt !== undefined) sheet.getRange(i + 1, 12).setValue(updates.updatedAt);
          
          found = true;
          result = { 
            success: true, 
            message: 'Article updated successfully',
            articleId: id
          };
          break;
        }
      }
      
      if (!found) {
        result = { 
          success: false, 
          message: 'Article not found',
          articleId: id
        };
      }
    }
    
    else if (data.action === 'delete') {
      const id = data.id;
      
      // Find and delete the row with the matching ID
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      let found = false;
      for (let i = 1; i < values.length; i++) { // Skip header row
        if (values[i][0] === id) {
          sheet.deleteRow(i + 1);
          found = true;
          result = { 
            success: true, 
            message: 'Article deleted successfully',
            articleId: id
          };
          break;
        }
      }
      
      if (!found) {
        result = { 
          success: false, 
          message: 'Article not found',
          articleId: id
        };
      }
    }
    
    else {
      result = { 
        success: false, 
        message: 'Invalid action. Use: add, update, or delete' 
      };
    }
    
    // Return response with proper MIME type
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    const errorResult = { 
      success: false, 
      error: error.toString() 
    };
    
    return ContentService.createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById('1tbP-Z1RaGQ8CzsBhme44gCF1nFYZoZy7qhKvCLrjF3k').getSheetByName('Articles');
    
    // Check if there's a specific action requested
    if (e.parameter.action === 'getAll') {
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      if (values.length <= 1) {
        // Only header row or empty sheet
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          articles: [],
          message: 'No articles found'
        }))
        .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Convert rows to article objects (skip header row)
      const articles = values.slice(1).map((row, index) => ({
        id: row[0] || `article-${index + 1}`,
        title: row[1] || '',
        content: row[2] || '',
        excerpt: row[3] || '',
        coverImage: row[4] || '',
        tags: row[5] ? row[5].split(',').map(tag => tag.trim()) : [],
        status: row[6] || 'draft',
        author: row[7] || 'Unknown',
        readTime: parseInt(row[8]) || 5,
        publishedAt: row[9] || '',
        createdAt: row[10] || new Date().toISOString(),
        updatedAt: row[11] || new Date().toISOString(),
      }));
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        articles: articles,
        count: articles.length,
        message: `Retrieved ${articles.length} articles successfully`
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default response
    const result = {
      success: true,
      message: 'Google Apps Script is running and ready to handle article operations',
      availableActions: ['add', 'update', 'delete', 'getAll'],
      endpoints: {
        getAll: '?action=getAll',
        add: 'POST with action: "add"',
        update: 'POST with action: "update"',
        delete: 'POST with action: "delete"'
      }
    };
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    const errorResult = { 
      success: false, 
      error: error.toString(),
      message: 'Error processing GET request'
    };
    
    return ContentService.createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle preflight OPTIONS request for CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
