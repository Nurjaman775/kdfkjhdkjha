$(document).ready(function () {
    let currentInput = '';
    let resultDisplayed = false;
    let lastResult = null; // Menyimpan hasil terakhir

    // Fungsi untuk menampilkan hasil
    function displayResult() {
        $('#Hasil').text(currentInput || '0');
    }

    // Tombol angka
    $('.tombol-angka').on('click', function () {
        if (resultDisplayed) {
            // Jika hasil ditampilkan, mulailah input baru
            currentInput = $(this).text();
            resultDisplayed = false;
        } else {
            // Tambahkan angka ke input saat ini
            currentInput += $(this).text();
        }
        displayResult();
    });

    // Tombol operasi
    $('.tombol-operasi').on('click', function () {
        const operatorSymbol = $(this).text();

        // Cek jika currentInput tidak kosong
        if (currentInput) {
            const lastChar = currentInput.trim().slice(-1); // Ambil karakter terakhir setelah di trim

            // Cegah penambahan operator berulang
            if (['+', '-', 'x', '/', '%', '^'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1); // Hapus operator terakhir
            }

            // Tambahkan operator baru
            if (!currentInput.endsWith(',')) {
                // Jika hasil sudah ditampilkan, ganti hasil dengan operator baru
                if (resultDisplayed) {
                    currentInput = lastResult + ' ' + operatorSymbol + ' '; // Gunakan hasil terakhir
                    resultDisplayed = false; // Setel kembali agar tidak mengganggu
                } else {
                    currentInput += ' ' + operatorSymbol + ' '; // Tambahkan operator dengan spasi
                }
            }
            displayResult();
        }
    });

    // Tombol faktorial
    $('.tombol-faktorial').on('click', function () {
        const num = parseInt(currentInput);
        if (!isNaN(num)) {
            currentInput = factorial(num).toString();
            displayResult();
        }
    });

    // Fungsi untuk menghitung faktorial
    function factorial(n) {
        if (n < 0) return 'NaN';
        if (n === 0) return 1;
        return n * factorial(n - 1);
    }

    // Tombol untuk clear
    $('#btn-clear').on('click', function () {
        currentInput = '';
        lastResult = null; // Reset hasil terakhir
        displayResult();
    });

    // Tombol untuk backspace
    $('#btn-backspace').on('click', function () {
        currentInput = currentInput.slice(0, -1);
        displayResult();
    });

    // Tombol koma
    $('.tombol-aktif.bg-purpel').on('click', function () {
        // Cek jika input tidak kosong dan karakter terakhir bukan operator
        if (currentInput && !['+', '-', 'x', '/', '%', '^'].includes(currentInput.trim().slice(-1))) {
            // Tambahkan koma (,) ke currentInput jika tidak ada koma sebelumnya
            if (!currentInput.endsWith(',')) {
                currentInput += ',';
            }
        }
        displayResult();
    });

    // Tombol untuk mengubah tanda (negatif/positif)
    $('.tombol.tonggel-negatif').on('click', function () {
        if (currentInput) {
            const lastNum = currentInput.split(' ').pop(); // Ambil angka terakhir
            const lastNumValue = parseFloat(lastNum);

            // Ubah tanda angka terakhir
            if (!isNaN(lastNumValue)) {
                const newNum = lastNumValue * -1;
                currentInput = currentInput.slice(0, -lastNum.length) + newNum; // Ganti angka terakhir
            }
        }
        displayResult();
    });

    // Tombol hitung
    $('#btn-hitung').on('click', function () {
        try {
            // Mengganti 'x' dengan '*', ',' dengan '.', dan mempersiapkan ekspresi
            const expression = currentInput.replace(/x/g, '*').replace(/,/g, '.');

            // Menghitung hasil
            const result = evalExpression(expression);
            if (result !== null) {
                // Jika ada hasil, tambahkan hasil ke currentInput
                if (resultDisplayed) {
                    // Jika hasil sudah ditampilkan, tambahkan ke hasil terakhir
                    currentInput = lastResult + ' + ' + result; // Misalnya, "25 + 5"
                } else {
                    currentInput += ' = ' + result; // Tambahkan hasil ke currentInput
                }
                lastResult = result; // Simpan hasil terakhir
            } else {
                currentInput = 'error'; // Set ke 'Error' jika ada masalah
            }
            resultDisplayed = true; // Tandai hasil sudah ditampilkan
            displayResult();
        } catch (e) {
            currentInput = 'error'; // Set ke 'Error' jika terjadi kesalahan
            displayResult();
        }
    });

    // Fungsi untuk mengevaluasi ekspresi
    function evalExpression(expr) {
        // Memecah ekspresi berdasarkan spasi
        const parts = expr.split(' ');

        // Memproses persen
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === '%') {
                const numberBefore = parseFloat(parts[i - 1]);
                if (i > 0 && !isNaN(numberBefore)) {
                    // Jika persentase, kita mengganti sebelumnya dengan hasil
                    const percentageValue = numberBefore / 100;
                    parts.splice(i - 1, 2, percentageValue); // Ganti dengan nilai persentase
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
                    parts.splice(i - 1, 3, powerResult); // Mengganti 3 bagian dengan hasil pangkat
                    i--; // Kembali satu langkah untuk mengevaluasi lagi jika ada operasi lainnya
                }
            }
        }

        // Evaluasi sisa ekspresi
        let result = eval(parts.join(' '));
        return result;
    }
});
