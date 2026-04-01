document.addEventListener('DOMContentLoaded', () => {
    
    const inputRm = document.getElementById('rm');
    const blocoRm = document.getElementById('bloco-rm');

    // Só roda se encontrar os elementos na tela
    if (inputRm && blocoRm) {
        inputRm.addEventListener('blur', () => {
            const valorDigitado = inputRm.value;

            if (valorDigitado.length > 0 && valorDigitado.length < 5) {
                blocoRm.classList.add('com-erro');
            } else {
                blocoRm.classList.remove('com-erro');
            }
        });

        inputRm.addEventListener('input', () => {
            blocoRm.classList.remove('com-erro');
        });
    } else {
        console.error("ERRO: Não achei o id 'rm' ou 'bloco-rm' no HTML.");
    }
    // ==========================================
    // VALIDAÇÃO DO E-MAIL INSTITUCIONAL
    // ==========================================
    const inputEmail = document.getElementById('email');
    const blocoEmail = document.getElementById('bloco-email');

    if (inputEmail && blocoEmail) {
        inputEmail.addEventListener('blur', () => {
            const valorDigitado = inputEmail.value.trim(); // .trim() remove espaços em branco acidentais

            // Se ele digitou algo e NÃO termina com @etec.sp.gov.br
            if (valorDigitado.length > 0 && !valorDigitado.endsWith('@etec.sp.gov.br')) {
                blocoEmail.classList.add('com-erro');
            } else {
                blocoEmail.classList.remove('com-erro');
            }
        });

        // Remove o erro assim que o aluno volta a digitar para corrigir
        inputEmail.addEventListener('input', () => {
            blocoEmail.classList.remove('com-erro');
        });
    }

});