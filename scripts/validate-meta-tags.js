#!/usr/bin/env node

/**
 * Meta Tags Validation Script
 * 
 * This script validates the generated meta tag HTML files
 * to ensure they contain all required meta tags for social media sharing.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Required meta tags for each content type
 */
const requiredMetaTags = {
  article: [
    'og:type',
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'article:author',
    'article:published_time',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image'
  ],
  photo: [
    'og:type',
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image'
  ],
  project: [
    'og:type',
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image'
  ]
};

/**
 * Extract meta tags from HTML content
 */
const extractMetaTags = (htmlContent) => {
  const metaTags = {};
  
  // Extract property-based meta tags (Open Graph)
  const propertyRegex = /<meta\s+property="([^"]+)"\s+content="([^"]+)"/g;
  let match;
  while ((match = propertyRegex.exec(htmlContent)) !== null) {
    metaTags[match[1]] = match[2];
  }
  
  // Extract name-based meta tags (Twitter, etc.)
  const nameRegex = /<meta\s+name="([^"]+)"\s+content="([^"]+)"/g;
  while ((match = nameRegex.exec(htmlContent)) !== null) {
    metaTags[match[1]] = match[2];
  }
  
  return metaTags;
};

/**
 * Validate a single HTML file
 */
const validateHtmlFile = (filePath, contentType) => {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const extractedTags = extractMetaTags(htmlContent);
    const required = requiredMetaTags[contentType] || [];
    
    const results = {
      file: path.basename(filePath),
      contentType,
      passed: true,
      missing: [],
      present: [],
      warnings: []
    };
    
    // Check required meta tags
    required.forEach(tag => {
      if (extractedTags[tag]) {
        results.present.push(tag);
      } else {
        results.missing.push(tag);
        results.passed = false;
      }
    });
    
    // Check for common issues
    if (extractedTags['og:image'] && !extractedTags['og:image'].startsWith('http')) {
      results.warnings.push('og:image should be a full URL');
    }
    
    if (extractedTags['og:title'] && extractedTags['og:title'].length > 95) {
      results.warnings.push('og:title is too long (>95 characters)');
    }
    
    if (extractedTags['og:description'] && extractedTags['og:description'].length > 300) {
      results.warnings.push('og:description is too long (>300 characters)');
    }
    
    // Check for structured data
    const hasStructuredData = htmlContent.includes('application/ld+json');
    if (!hasStructuredData) {
      results.warnings.push('Missing structured data (JSON-LD)');
    }
    
    return results;
    
  } catch (error) {
    return {
      file: path.basename(filePath),
      contentType,
      passed: false,
      error: error.message
    };
  }
};

/**
 * Validate all generated HTML files
 */
const validateAllFiles = () => {
  const distDir = path.join(__dirname, '../dist');
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    files: []
  };
  
  // Content type directories to check
  const contentTypes = {
    'article': 'article',
    'photos': 'photo',
    'projects': 'project'
  };
  
  Object.entries(contentTypes).forEach(([dir, contentType]) => {
    const dirPath = path.join(distDir, dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      return;
    }
    
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.html'));
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const validation = validateHtmlFile(filePath, contentType);
      results.files.push(validation);
      results.total++;
      
      if (validation.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
    });
  });
  
  return results;
};

/**
 * Display validation results
 */
const displayResults = (results) => {
  console.log('🧪 Meta Tags Validation Results');
  console.log('================================\n');
  
  console.log(`📊 Summary:`);
  console.log(`   Total files: ${results.total}`);
  console.log(`   Passed: ${results.passed} ✅`);
  console.log(`   Failed: ${results.failed} ❌`);
  console.log(`   Success rate: ${Math.round((results.passed / results.total) * 100)}%\n`);
  
  // Group results by status
  const passed = results.files.filter(f => f.passed);
  const failed = results.files.filter(f => !f.passed);
  
  if (passed.length > 0) {
    console.log('✅ Passed Files:');
    passed.forEach(file => {
      console.log(`   ${file.file} (${file.contentType})`);
      if (file.warnings && file.warnings.length > 0) {
        file.warnings.forEach(warning => {
          console.log(`     ⚠️  ${warning}`);
        });
      }
    });
    console.log('');
  }
  
  if (failed.length > 0) {
    console.log('❌ Failed Files:');
    failed.forEach(file => {
      console.log(`   ${file.file} (${file.contentType})`);
      if (file.error) {
        console.log(`     Error: ${file.error}`);
      } else if (file.missing && file.missing.length > 0) {
        console.log(`     Missing tags: ${file.missing.join(', ')}`);
      }
    });
    console.log('');
  }
  
  // Recommendations
  console.log('📋 Recommendations:');
  if (results.failed > 0) {
    console.log('   1. Fix missing meta tags in failed files');
    console.log('   2. Re-run the meta tag generation script');
  }
  console.log('   3. Test with social media validators:');
  console.log('      - Facebook: https://developers.facebook.com/tools/debug/');
  console.log('      - Twitter: https://cards-dev.twitter.com/validator');
  console.log('      - LinkedIn: https://www.linkedin.com/post-inspector/');
  
  return results.passed === results.total;
};

/**
 * Generate validation report
 */
const generateReport = (results) => {
  const reportPath = path.join(__dirname, 'meta-tags-validation-report.json');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      successRate: Math.round((results.passed / results.total) * 100)
    },
    files: results.files
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Validation report saved to: ${reportPath}`);
};

/**
 * Main validation function
 */
const runValidation = () => {
  console.log('🚀 Starting meta tags validation...\n');
  
  try {
    const results = validateAllFiles();
    
    if (results.total === 0) {
      console.log('⚠️  No HTML files found to validate.');
      console.log('   Make sure to run "npm run meta:test" first to generate the files.');
      return false;
    }
    
    const allPassed = displayResults(results);
    generateReport(results);
    
    if (allPassed) {
      console.log('\n🎉 All meta tags validation passed! Your files are ready for social media sharing.');
      return true;
    } else {
      console.log('\n⚠️  Some validations failed. Please fix the issues and re-run the validation.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    console.error('Error details:', error.stack);
    return false;
  }
};

// Export functions
export {
  validateHtmlFile,
  validateAllFiles,
  extractMetaTags,
  displayResults,
  generateReport
};

// Run validation if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = runValidation();
  process.exit(success ? 0 : 1);
}
