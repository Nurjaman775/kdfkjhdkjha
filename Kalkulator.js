$(document).ready(function () {
    let currentInput = '';
    let resultDisplayed = false;
    let lastResult = null;

    function displayResult() {
        $('#Hasil').text(currentInput || '0');
    }

    $('.tombol-angka').on('click', function () {
        if (resultDisplayed) {
            currentInput = $(this).text();
            resultDisplayed = false;
        } else {
            currentInput += $(this).text();
        }
        displayResult();
    });

    $('.tombol-operasi').on('click', function () {
        const operatorSymbol = $(this).text();
        if (currentInput) {
            const lastChar = currentInput.trim().slice(-1);
            if (['+', '-', 'x', '/', '%', '^'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1);
            }
            if (!currentInput.endsWith(',')) {
                if (resultDisplayed) {
                    currentInput = lastResult + ' ' + operatorSymbol + ' ';
                    resultDisplayed = false;
                } else {
                    currentInput += ' ' + operatorSymbol + ' ';
                }
            }
            displayResult();
        }
    });

    $('.tombol-faktorial').on('click', function () {
        const num = parseInt(currentInput);
        if (!isNaN(num)) {
            currentInput = factorial(num).toString();
            displayResult();
        }
    });

    function factorial(n) {
        if (n < 0) return 'NaN';
        if (n === 0) return 1;
        return n * factorial(n - 1);
    }

    $('#btn-clear').on('click', function () {
        currentInput = '';
        lastResult = null;
        displayResult();
    });

    $('#btn-backspace').on('click', function () {
        currentInput = currentInput.slice(0, -1);
        displayResult();
    });

    $('.tombol-aktif.bg-purpel').on('click', function () {
        if (currentInput && !['+', '-', 'x', '/', '%', '^'].includes(currentInput.trim().slice(-1))) {
            if (!currentInput.endsWith(',')) {
                currentInput += ',';
            }
        }
        displayResult();
    });

    $('.tombol.tonggel-negatif').on('click', function () {
        if (currentInput) {
            const lastNum = currentInput.split(' ').pop();
            const lastNumValue = parseFloat(lastNum);
            if (!isNaN(lastNumValue)) {
                const newNum = lastNumValue * -1;
                currentInput = currentInput.slice(0, -lastNum.length) + newNum;
            }
        }
        displayResult();
    });

    $('#btn-hitung').on('click', function () {
        try {
            const expression = currentInput.replace(/x/g, '*').replace(/,/g, '.');
            const result = evalExpression(expression);
            if (result !== null) {
                if (resultDisplayed) {
                    currentInput = lastResult + ' + ' + result;
                } else {
                    currentInput += ' = ' + result;
                }
                lastResult = result;
            } else {
                currentInput = 'error';
            }
            resultDisplayed = true;
            displayResult();
        } catch (e) {
            currentInput = 'error';
            displayResult();
        }
    });

    function evalExpression(expr) {
        const parts = expr.split(' ');

        // Proses operator '%' sebagai persentase
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === '%') {
                const numberBefore = parseFloat(parts[i - 1]);
                if (i > 0 && !isNaN(numberBefore)) {
                    let percentageValue;
                    if (i + 1 < parts.length && !isNaN(parts[i + 1])) {
                        const numberAfter = parseFloat(parts[i + 1]);
                        percentageValue = (numberBefore * numberAfter) / 100;
                        parts.splice(i - 1, 3, percentageValue);
                    } else {
                        percentageValue = numberBefore / 100;
                        parts.splice(i - 1, 2, percentageValue);
                    }
                    i--;
                }
            }
        }

        // Menghitung pangkat
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === '^') {
                const base = parseFloat(parts[i - 1]);
                const exponent = parseFloat(parts[i + 1]);
                if (!isNaN(base) && !isNaN(exponent)) {
                    const powerResult = Math.pow(base, exponent);
                    parts.splice(i - 1, 3, powerResult);
                    i--;
                }
            }
        }

        let result = eval(parts.join(' '));
        return result;
    }
});
