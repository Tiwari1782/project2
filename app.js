// Simple Calculator JavaScript
let display = '';
let shouldResetDisplay = false;

// Initialize display
window.onload = function() {
    document.getElementById('result').value = '0';
};

// Append values to display
function appendToDisplay(value) {
    const resultElement = document.getElementById('result');
    
    if (shouldResetDisplay) {
        display = '';
        shouldResetDisplay = false;
    }
    
    // Handle first input
    if (display === '' && resultElement.value === '0') {
        if (value === '.') {
            display = '0.';
        } else if (isOperator(value)) {
            display = '0' + value;
        } else {
            display = value;
        }
    } else {
        // Prevent multiple consecutive operators
        if (isOperator(value) && isOperator(display.slice(-1))) {
            display = display.slice(0, -1) + value;
        } else {
            display += value;
        }
    }
    
    resultElement.value = display;
    resultElement.classList.remove('error');
}

// Check if a character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Clear the display
function clearDisplay() {
    display = '';
    document.getElementById('result').value = '0';
    document.getElementById('result').classList.remove('error');
}

// Delete last character
function deleteLast() {
    const resultElement = document.getElementById('result');
    
    if (display.length > 0) {
        display = display.slice(0, -1);
        resultElement.value = display || '0';
    }
    
    resultElement.classList.remove('error');
}

// Calculate the result
function calculate() {
    const resultElement = document.getElementById('result');
    
    if (display === '') {
        return;
    }
    
    try {
        // Replace × symbol with * for calculation
        let expression = display.replace(/×/g, '*');
        
        // Check for division by zero
        if (expression.includes('/0') && !expression.includes('/0.')) {
            throw new Error('Division by zero');
        }
        
        // Evaluate the expression safely
        let result = evaluateExpression(expression);
        
        // Handle special cases
        if (!isFinite(result)) {
            throw new Error('Invalid operation');
        }
        
        // Format the result
        if (result % 1 === 0) {
            result = result.toString();
        } else {
            result = parseFloat(result.toFixed(10)).toString();
        }
        
        display = result;
        resultElement.value = result;
        shouldResetDisplay = true;
        
    } catch (error) {
        resultElement.value = 'Error';
        resultElement.classList.add('error');
        display = '';
        shouldResetDisplay = true;
    }
}

// Safe expression evaluation
function evaluateExpression(expression) {
    // Remove any non-numeric characters except operators and decimal points
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        throw new Error('Invalid characters');
    }
    
    // Use Function constructor for safe evaluation
    return Function('"use strict"; return (' + expression + ')')();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Handle number keys
    if ('0123456789'.includes(key)) {
        appendToDisplay(key);
    }
    
    // Handle operator keys
    else if ('+-*/'.includes(key)) {
        appendToDisplay(key);
    }
    
    // Handle decimal point
    else if (key === '.') {
        appendToDisplay(key);
    }
    
    // Handle equals and enter
    else if (key === '=' || key === 'Enter') {
        calculate();
    }
    
    // Handle clear (Escape)
    else if (key === 'Escape') {
        clearDisplay();
    }
    
    // Handle backspace
    else if (key === 'Backspace') {
        deleteLast();
    }
});