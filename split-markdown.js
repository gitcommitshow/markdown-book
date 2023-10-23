/**
** Split a big markdown files to smaller files arranges in folders according to the heading and subheadings
** Usage: splitMarkdown('path_to_your_markdown.md', );
**/
const fs = require('fs');
const path = require('path');

function splitMarkdown(mdPath, headingSeparator, subheadingSeparator) {
    if(!mdPath) mdPath = 'demobook.md';
    if(!headingSeparator) headingSeparator = '#';
    if(!subheadingSeparator) subheadingSeparator = '##';
    const content = fs.readFileSync(mdPath, 'utf-8');

    // Split content based on main headings
    const mainSections = content.split('\n'+headingSeparator+' ');

    mainSections.slice(1).forEach(section => {
        const lines = section.split('\n');
        const folderName = lines[0].trim().replace(/ /g, '_');
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }

        const subSections = section.split('\n'+subheadingSeparator+' ').slice(1);

        if (subSections.length) {
            fs.writeFileSync(path.join(folderName, 'index.md'), lines.slice(0, lines.indexOf('## ' + subSections[0])).join('\n'));

            subSections.forEach(subSection => {
                const subLines = subSection.split('\n');
                const fileName = subLines[0].trim().replace(/ /g, '_') + '.md';
                fs.writeFileSync(path.join(folderName, fileName), subSection);
            });
        } else {
            fs.writeFileSync(path.join(folderName, 'index.md'), section);
        }
    });
}


module.exports = {
    splitMarkdown
};
