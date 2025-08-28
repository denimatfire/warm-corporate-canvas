# 🗑️ Automatic Image Cleanup on Article Deletion

This document explains how the system automatically cleans up Supabase Storage images when articles are deleted, preventing orphaned images from accumulating in storage.

## 🔄 How It Works

### 1. **Article Deletion Process**
When an article is deleted, the system follows this sequence:

1. **Fetch Article Data** - Retrieve the article before deletion to extract image information
2. **Extract Image Paths** - Parse content and cover image to find all associated images
3. **Delete Images** - Remove all images from Supabase Storage
4. **Delete Article** - Remove the article from the database

### 2. **Image Detection**
The system identifies images in two ways:

#### **Cover Images**
- Extracted from `article.cover_image_path` field
- Direct path to the image in Supabase Storage

#### **Content Images**
- Parsed from HTML content using `DOMParser`
- Searches for `<img>` tags with `src` attributes
- Filters for Supabase-hosted images only

### 3. **Image Path Extraction**
```typescript
// Example Supabase URL:
// https://xxx.supabase.co/storage/v1/object/public/Article_images/content-images/123456-abc123.jpg

// Extracted path:
// content-images/123456-abc123.jpg
```

## 🛠️ Implementation Details

### **Core Function: `articlesApi.delete()`**
```typescript
async delete(id: string): Promise<boolean> {
  // 1. Fetch article before deletion
  const article = await this.getArticleById(id);
  
  // 2. Extract all image paths
  const imagePaths = this.extractAllImagePaths(article);
  
  // 3. Delete images from storage
  await this.deleteImagesFromStorage(imagePaths);
  
  // 4. Delete article from database
  await this.deleteArticleFromDatabase(id);
}
```

### **Helper Functions**

#### **`extractImagePathsFromContent(content: string)`**
- Parses HTML content using `DOMParser`
- Finds all `<img>` tags
- Filters for Supabase URLs
- Extracts storage paths

#### **`isSupabaseImageUrl(url: string)`**
- Checks if URL is from Supabase Storage
- Verifies `supabase.co` domain
- Confirms `Article_images` bucket

#### **`extractImagePathFromUrl(url: string)`**
- Parses Supabase Storage URL
- Extracts relative path from bucket
- Returns storage path for deletion

#### **`deleteImagesFromStorage(imagePaths: string[])`**
- Uses `batchDeleteImages` from `image-upload.ts`
- Handles multiple image deletions
- Reports success/failure for each image

## 📊 Image Types Handled

### **Cover Images**
- **Location**: `Article_images/cover-images/`
- **Storage**: `article.cover_image_path` field
- **Cleanup**: Automatically deleted with article

### **Content Images**
- **Location**: `Article_images/content-images/`
- **Storage**: Embedded in article HTML content
- **Cleanup**: Parsed and deleted with article

### **External Images**
- **Location**: External URLs (not Supabase)
- **Storage**: Not stored in our system
- **Cleanup**: Ignored (no cleanup needed)

## 🚀 Benefits

### **Automatic Cleanup**
- ✅ **No orphaned images** in Supabase Storage
- ✅ **Storage space optimization** 
- ✅ **Cost reduction** for storage usage
- ✅ **Clean database** without broken image references

### **Error Handling**
- ✅ **Graceful degradation** if image deletion fails
- ✅ **Article deletion continues** even with image errors
- ✅ **Detailed logging** for debugging
- ✅ **Fallback support** for offline scenarios

### **Performance**
- ✅ **Batch deletion** for multiple images
- ✅ **Efficient parsing** using native DOMParser
- ✅ **Minimal database queries** (single fetch before deletion)

## 🔍 Monitoring & Debugging

### **Console Logs**
```typescript
// Successful deletion
🗑️ Deleted 5 images for article abc123

// Partial failure
⚠️ Failed to delete some images for article abc123: [error details]

// Image deletion results
✅ Successfully deleted 4 images
⚠️ Failed to delete 1 images: [failed paths]
```

### **Error Scenarios**
1. **Image deletion fails** - Article still deleted, images remain in storage
2. **Parsing errors** - Content images may not be detected
3. **Network issues** - Images may not be deleted immediately
4. **Storage permissions** - Some images may be protected

## 🛡️ Safety Features

### **Duplicate Prevention**
- Removes duplicate image paths before deletion
- Filters out `null` or empty paths
- Handles multiple references to same image

### **Fallback Handling**
- Continues article deletion even if image cleanup fails
- Logs warnings for failed image deletions
- Maintains system stability

### **Content Validation**
- Safely parses HTML content
- Handles malformed HTML gracefully
- Filters for valid Supabase image URLs only

## 📱 Offline Support

### **LocalStorage Fallback**
When Supabase is unavailable:
- Article deletion works locally
- Images cannot be deleted from storage
- Manual cleanup required when online
- System logs offline status

### **Reconnection Handling**
- Automatic retry when Supabase reconnects
- Queued operations may execute
- Manual cleanup tools available

## 🔧 Manual Cleanup Tools

### **TipTap Editor Cleanup**
- **Automatic cleanup** every 5 minutes
- **Manual cleanup** button in toolbar
- **Image tracking** for uploaded content
- **Storage statistics** display

### **Admin Tools**
- **Bulk cleanup** for multiple articles
- **Storage analysis** and reporting
- **Orphaned image detection**
- **Manual deletion** interface

## 📚 Related Documentation

- [Image Upload System](IMAGE_UPLOAD_SUMMARY.md)
- [TipTap Editor Features](TIPTAP_EDITOR_README.md)
- [Article Management](ARTICLE_MANAGEMENT_README.md)
- [Supabase Setup](SUPABASE_SETUP.md)

## 🚨 Important Notes

### **Irreversible Action**
- **Article deletion is permanent**
- **All associated images are permanently deleted**
- **No recovery mechanism** for deleted content
- **Backup recommended** before bulk deletions

### **Storage Considerations**
- **Images are deleted immediately** upon article deletion
- **No soft delete** for images
- **Storage space freed** immediately
- **Cost reduction** reflected in next billing cycle

### **Performance Impact**
- **Slight delay** in article deletion (image cleanup)
- **Network dependent** for image deletion
- **Batch processing** for multiple images
- **Minimal impact** on user experience

---

## 🎯 Summary

The automatic image cleanup system ensures that:

1. **No orphaned images** remain in Supabase Storage
2. **Storage costs** are optimized automatically
3. **Database integrity** is maintained
4. **User experience** is seamless
5. **System resources** are efficiently managed

This feature provides a clean, automated solution for maintaining storage hygiene while ensuring robust error handling and system stability.

---

*Last updated: January 2025*  
*System Version: Warm Corporate Canvas v2.0*
