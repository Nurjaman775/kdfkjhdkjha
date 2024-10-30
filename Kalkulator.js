$(document).ready(function () {
    let currentInput = '';
    let resultDisplayed = false;
    let lastResult = null;

    function displayResult() {
        $('#Hasil').text(currentInput || '0');
    }

    // Fungsi untuk menambahkan angka ke tampilan
    $('.tombol-angka').on('click', function () {
        if (resultDisplayed) {
            currentInput = $(this).text();
            resultDisplayed = false;
        } else {
            currentInput += $(this).text();
        }
        displayResult();
    });

    // Fungsi untuk operasi dasar
    $('.tombol-operasi').on('click', function () {
        const operatorSymbol = $(this).text();
        if (currentInput) {
            const lastChar = currentInput.trim().slice(-1);
            if (['+', '-', 'x', '/', '%', '^'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1);
            }
            if (!currentInput.endsWith(',')) {
                currentInput += ` ${operatorSymbol} `;
                resultDisplayed = false;
            }
            displayResult();
        }
    });

    // Tombol untuk perhitungan faktorial
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

    // Tombol clear dan backspace
    $('#btn-clear').on('click', function () {
        currentInput = '';
        lastResult = null;
        displayResult();
    });

    $('#btn-backspace').on('click', function () {
        currentInput = currentInput.slice(0, -1);
        displayResult();
    });

    // Fungsi untuk koma dan tanda negatif
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

    // Tombol hitung
    $('#btn-hitung').on('click', function () {
        try {
            const expression = currentInput.replace(/x/g, '*').replace(/,/g, '.');
            const result = evalExpression(expression);
            if (result !== null) {
                currentInput = resultDisplayed ? `${lastResult} + ${result}` : `${currentInput} = ${result}`;
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

    // Fungsi evaluasi ekspresi dengan operator modulus dan persentase
    function evalExpression(expr) {
        const parts = expr.split(' ');

        // Menghitung persentase
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === '%' && !isNaN(parts[i - 1])) {
                const numberBefore = parseFloat(parts[i - 1]);

                if (['+', '-', '*', '/'].includes(parts[i - 2])) {
                    // Menggunakan sebagai persentase (contoh: 5 x 5% = 0.25)
                    parts[i - 1] = (numberBefore / 100).toString();
                    parts.splice(i, 1); // Hapus simbol %
                } else {
                    // Jika tidak ada operator sebelum angka, gunakan modulus
                    const numberAfter = parseFloat(parts[i + 1]);
                    if (!isNaN(numberAfter)) {
                        const modulusValue = numberBefore % numberAfter;
                        parts.splice(i - 1, 3, modulusValue);
                        i--;
                    }
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

        // Evaluasi sisa ekspresi
        let result = eval(parts.join(' '));
        return result;
    }
});
