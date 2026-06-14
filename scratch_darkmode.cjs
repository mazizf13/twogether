const fs = require('fs');
const path = require('path');

const replacements = [
    { regex: /(?<!dark:)bg-white/g, replacement: 'bg-white dark:bg-neutral-950' },
    { regex: /(?<!dark:)text-neutral-900/g, replacement: 'text-neutral-900 dark:text-neutral-100' },
    { regex: /(?<!dark:)text-neutral-700/g, replacement: 'text-neutral-700 dark:text-neutral-200' },
    { regex: /(?<!dark:)text-neutral-600/g, replacement: 'text-neutral-600 dark:text-neutral-300' },
    { regex: /(?<!dark:)text-neutral-500/g, replacement: 'text-neutral-500 dark:text-neutral-400' },
    { regex: /(?<!dark:)bg-neutral-50/g, replacement: 'bg-neutral-50 dark:bg-neutral-900' },
    { regex: /(?<!dark:)bg-neutral-100/g, replacement: 'bg-neutral-100 dark:bg-neutral-800' },
    { regex: /(?<!dark:)border-neutral-100/g, replacement: 'border-neutral-100 dark:border-neutral-800' },
    { regex: /(?<!dark:)border-neutral-200/g, replacement: 'border-neutral-200 dark:border-neutral-800' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
            // Need to handle duplicates in case script is run multiple times
            // This is handled by negative lookbehind in regex: `(?<!dark:)`
            content = content.replace(regex, replacement);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

processDirectory('./resources/js');
console.log('Done replacing Tailwind classes for dark mode.');
