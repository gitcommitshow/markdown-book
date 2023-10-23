const { execSync } = require('child_process');
const fs = require('fs');

const { splitMarkdown } = require('./split-markdown');

const BIG_FILE_MIN_LINES = 1000;
const BASE_SHA = process.env.GITHUB_BASE_SHA || '';  // Base commit SHA from GitHub environment variables
const HEAD_SHA = process.env.GITHUB_SHA || '';       // Latest commit SHA from GitHub environment variables

// Fetch the list of changed files between the base and head commits
const getChangedFiles = () => {
    const output = execSync(`git diff --name-only ${BASE_SHA} ${HEAD_SHA}`).toString();
    return output.split('\n').filter(name => name.endsWith('.md'));
};

// Check if a file has a minimum word count
const hasMinimumWordCount = (filePath, minCount) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const words = content.split(/\s+/).filter(Boolean);
    return words.length >= minCount;
};

// Main function to process markdown files
const processMarkdownFiles = () => {
    const markdownFiles = getChangedFiles();

    markdownFiles.forEach(file => {
        if (hasMinimumWordCount(file, BIG_FILE_MIN_LINES)) {
            // Call the splitMarkdown function (from previous Node.js script)
            splitMarkdown(file);
        }
    });
};

processMarkdownFiles();
