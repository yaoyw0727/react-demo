/**
 * 合并翻译资源脚本
 * 将所有的翻译资源合并到一个文件中，便于定位翻译问题
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// 语言列表
const languages = ['zh-cn', 'en-us'];

// 命名空间映射
const namespaceMap = {
  framework: 'src/locales',
  home: 'src/pages/Home/locales',
  about: 'src/pages/About/locales',
  user: 'src/pages/System/User/locales',
  role: 'src/pages/System/Role/locales',
  product: 'src/pages/Product/ProductList/locales',
  productCategory: 'src/pages/Product/ProductCategory/locales'
};

/**
 * 读取JSON文件
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to read JSON file ${filePath}:`, error.message);
    return {};
  }
}

/**
 * 写入JSON文件
 */
function writeJsonFile(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Generated: ${path.relative(rootDir, filePath)}`);
  } catch (error) {
    console.error(`Failed to write JSON file ${filePath}:`, error.message);
  }
}

/**
 * 合并翻译资源
 */
function mergeTranslations() {
  console.log('🚀 Starting to merge translation resources...\n');
  
  // 输出目录
  const outputDir = path.join(rootDir, 'dist', 'locales');
  
  languages.forEach((lang) => {
    console.log(`📝 Processing ${lang} translations...`);
    
    const mergedTranslations = {};
    const translationReport = {
      language: lang,
      totalKeys: 0,
      namespaces: {},
      generatedAt: new Date().toISOString()
    };
    
    // 合并所有命名空间的翻译
    Object.entries(namespaceMap).forEach(([namespace, dirPath]) => {
      const translationFile = path.join(rootDir, dirPath, lang, 'translation.json');
      
      if (fs.existsSync(translationFile)) {
        const translations = readJsonFile(translationFile);
        const keyCount = Object.keys(flattenObject(translations, namespace)).length;
        
        // 记录命名空间信息
        translationReport.namespaces[namespace] = {
          path: dirPath,
          fileCount: 1,
          keyCount: keyCount
        };
        
        // 合并翻译（带命名空间前缀）
        const flattened = flattenObject(translations, namespace);
        Object.assign(mergedTranslations, flattened);
        
        console.log(`  ✓ ${namespace}: ${keyCount} keys from ${path.relative(rootDir, translationFile)}`);
      } else {
        console.warn(`  ⚠ ${namespace}: File not found at ${translationFile}`);
        translationReport.namespaces[namespace] = {
          path: dirPath,
          fileCount: 0,
          keyCount: 0,
          error: 'File not found'
        };
      }
    });
    
    // 统计总键数
    translationReport.totalKeys = Object.keys(mergedTranslations).length;
    
    // 生成合并后的翻译文件
    const mergedFilePath = path.join(outputDir, `${lang}.merged.json`);
    writeJsonFile(mergedFilePath, mergedTranslations);
    
    // 生成报告文件
    const reportFilePath = path.join(outputDir, `${lang}.report.json`);
    writeJsonFile(reportFilePath, translationReport);
    
    console.log(`  📊 Total: ${translationReport.totalKeys} keys\n`);
  });
  
  // 生成总报告
  const summaryReport = {
    generatedAt: new Date().toISOString(),
    languages: languages.length,
    namespaces: Object.keys(namespaceMap).length,
    outputDir: path.relative(rootDir, outputDir)
  };
  
  const summaryFilePath = path.join(outputDir, 'summary.json');
  writeJsonFile(summaryFilePath, summaryReport);
  
  console.log('✅ Translation merge completed!');
  console.log(`📁 Output directory: ${path.relative(rootDir, outputDir)}`);
}

/**
 * 扁平化对象，添加命名空间前缀
 */
function flattenObject(obj, namespace, prefix = '') {
  const result = {};
  
  function flatten(current, path) {
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const newPath = path ? `${path}.${key}` : key;
        const value = current[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flatten(value, newPath);
        } else {
          // 添加命名空间前缀
          const fullKey = namespace === 'framework' ? newPath : `${namespace}:${newPath}`;
          result[fullKey] = value;
        }
      }
    }
  }
  
  flatten(obj, '');
  return result;
}

/**
 * 生成翻译key映射文件（用于开发时快速查找）
 */
function generateKeyMapping() {
  console.log('\n🔍 Generating translation key mapping...');
  
  const keyMapping = {};
  const outputFile = path.join(rootDir, 'dist', 'locales', 'key-mapping.json');
  
  languages.forEach((lang) => {
    const mergedFile = path.join(rootDir, 'dist', 'locales', `${lang}.merged.json`);
    
    if (fs.existsSync(mergedFile)) {
      const translations = readJsonFile(mergedFile);
      keyMapping[lang] = {
        keyCount: Object.keys(translations).length,
        keys: Object.keys(translations).sort()
      };
    }
  });
  
  writeJsonFile(outputFile, keyMapping);
  console.log(`✓ Generated key mapping: ${path.relative(rootDir, outputFile)}`);
}

// 执行合并
mergeTranslations();
generateKeyMapping();