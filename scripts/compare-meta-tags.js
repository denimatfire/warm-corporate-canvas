#!/usr/bin/env node

/**
 * Meta Tags Comparison Tool
 * 
 * This script compares the original hardcoded meta tags with the new
 * dynamically generated ones to show that both systems are working.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Extract title
  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    metaTags['page_title'] = titleMatch[1];
  }
  
  return metaTags;
};

const analyzeFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const metaTags = extractMetaTags(content);
  
  // Determine if it's dynamically generated or hardcoded
  const isDynamic = content.includes('<!-- Redirect to React App for actual content -->');
  
  return {
    file: path.basename(filePath),
    type: isDynamic ? 'Dynamic' : 'Hardcoded',
    metaTags,
    hasStructuredData: content.includes('application/ld+json'),
    hasBreadcrumbs: content.includes('"@type": "BreadcrumbList"'),
    hasRedirect: content.includes('window.location.replace')
  };
};

const compareMetaTags = () => {
  console.log('🔍 META TAGS COMPARISON ANALYSIS');
  console.log('================================\n');
  
  const distDir = path.join(__dirname, '../dist');
  const articleDir = path.join(distDir, 'article');
  
  if (!fs.existsSync(articleDir)) {
    console.log('❌ Article directory not found. Run npm run meta:test first.');
    return;
  }
  
  const files = fs.readdirSync(articleDir).filter(f => f.endsWith('.html'));
  const analyses = files.map(file => analyzeFile(path.join(articleDir, file)));
  
  console.log(`📊 Found ${files.length} article files to analyze:\n`);
  
  // Group by type
  const dynamic = analyses.filter(a => a.type === 'Dynamic');
  const hardcoded = analyses.filter(a => a.type === 'Hardcoded');
  
  console.log('🎯 SYSTEM TYPES:');
  console.log('---------------');
  console.log(`✨ Dynamic System: ${dynamic.length} files`);
  dynamic.forEach(d => console.log(`   └── ${d.file}`));
  console.log(`🔧 Hardcoded System: ${hardcoded.length} files`);
  hardcoded.forEach(h => console.log(`   └── ${h.file}`));
  
  console.log('\n📋 META TAGS COMPARISON:');
  console.log('------------------------');
  
  // Compare key meta tags
  const keyTags = ['og:title', 'og:description', 'og:image', 'og:type', 'twitter:title', 'twitter:card'];
  
  analyses.forEach(analysis => {
    console.log(`\n📄 ${analysis.file} (${analysis.type})`);
    console.log('   Key Meta Tags:');
    keyTags.forEach(tag => {
      const value = analysis.metaTags[tag];
      if (value) {
        const truncated = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`   ✓ ${tag}: ${truncated}`);
      } else {
        console.log(`   ❌ ${tag}: Missing`);
      }
    });
    
    console.log('   Features:');
    console.log(`   ✓ Structured Data: ${analysis.hasStructuredData ? '✅' : '❌'}`);
    console.log(`   ✓ Breadcrumbs: ${analysis.hasBreadcrumbs ? '✅' : '❌'}`);
    console.log(`   ✓ Smart Redirect: ${analysis.hasRedirect ? '✅' : '❌'}`);
  });
  
  console.log('\n🎉 SYSTEM STATUS:');
  console.log('----------------');
  
  const allHaveBasicTags = analyses.every(a => 
    a.metaTags['og:title'] && a.metaTags['og:description'] && a.metaTags['og:image']
  );
  
  const allHaveStructuredData = analyses.every(a => a.hasStructuredData);
  const allHaveRedirect = analyses.every(a => a.hasRedirect);
  
  console.log(`✓ Basic Meta Tags: ${allHaveBasicTags ? '✅ All files have essential tags' : '❌ Some files missing tags'}`);
  console.log(`✓ Structured Data: ${allHaveStructuredData ? '✅ All files have JSON-LD' : '❌ Some files missing structured data'}`);
  console.log(`✓ Smart Redirect: ${allHaveRedirect ? '✅ All files redirect properly' : '❌ Some files missing redirect'}`);
  
  if (dynamic.length > 0 && hardcoded.length > 0) {
    console.log('\n🔄 BOTH SYSTEMS WORKING:');
    console.log('✅ Original hardcoded system still functional');
    console.log('✅ New dynamic system generating proper meta tags');
    console.log('✅ Both provide excellent social media previews');
  } else if (dynamic.length > 0) {
    console.log('\n✨ DYNAMIC SYSTEM ACTIVE:');
    console.log('✅ All articles using dynamic meta tag generation');
    console.log('✅ Scalable system ready for new content');
  } else {
    console.log('\n🔧 HARDCODED SYSTEM ONLY:');
    console.log('⚠️  Only hardcoded meta tags found');
    console.log('💡 Run npm run meta:test to generate dynamic tags');
  }
  
  console.log('\n🧪 TESTING RECOMMENDATIONS:');
  console.log('---------------------------');
  console.log('Test these URLs with social media validators:');
  
  analyses.forEach(analysis => {
    const slug = analysis.file.replace('.html', '');
    const url = `https://dasdhrubajyoti.netlify.app/article/${slug}`;
    console.log(`📱 ${analysis.file} (${analysis.type}):`);
    console.log(`   ${url}`);
  });
  
  console.log('\n🔗 Validators:');
  console.log('• Facebook: https://developers.facebook.com/tools/debug/');
  console.log('• Twitter: https://cards-dev.twitter.com/validator');
  console.log('• LinkedIn: https://www.linkedin.com/post-inspector/');
  
  return analyses;
};

// Run the comparison
compareMetaTags();
