'use strict';

const htmlEditorArea = document.getElementById('html-editor-area');
const jsEditorArea = document.getElementById('js-editor-area');
const consoleResultArea = document.getElementById('console-result-area');

const pageResult = document.getElementById('page-result');
const runButton = document.getElementById('run-button');

console.log = text => {
    consoleResultArea.innerText = consoleResultArea.innerHTML + text + "\n";
};

const clearResult = () => {
    consoleResultArea.innerText = '';
    pageResult.innerHTML = '';
};

const executeScript = () => {
    clearResult();
    const html = htmlEditorArea.value;
    const script = new Function(jsEditorArea.value);
    pageResult.innerHTML = html;
    script();
};

runButton.onclick = executeScript;

// Also we have an option to add another textarea for CSS and 
// use '<style>' + cssEditorArea.value + '</style>' to apply it
