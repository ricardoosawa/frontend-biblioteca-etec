document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. VALIDAÇÕES VISUAIS (RM e E-mail)
    // ==========================================
    
    const inputRm = document.getElementById('rm');
    const blocoRm = document.getElementById('bloco-rm');
    
    if (inputRm && blocoRm) {
        inputRm.addEventListener('blur', () => {
            const valorDigitado = inputRm.value;
            if (valorDigitado.length > 0 && valorDigitado.length < 5) {
                blocoRm.classList.add('com-erro');
            } else {
                blocoRm.classList.remove('com-erro');
            }
        });
        inputRm.addEventListener('input', () => blocoRm.classList.remove('com-erro'));
    }

    const inputEmail = document.getElementById('email');
    const blocoEmail = document.getElementById('bloco-email');

    if (inputEmail && blocoEmail) {
        inputEmail.addEventListener('blur', () => {
            const valorDigitado = inputEmail.value.trim();
            if (valorDigitado.length > 0 && !valorDigitado.endsWith('@etec.sp.gov.br')) {
                blocoEmail.classList.add('com-erro');
            } else {
                blocoEmail.classList.remove('com-erro');
            }
        });
        inputEmail.addEventListener('input', () => blocoEmail.classList.remove('com-erro'));
    }

    // ==========================================
    // 2. ENVIO DE DADOS (Formulário)
    // ==========================================

    const formAgendamento = document.getElementById('formAgendamento');

    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede a página de recarregar

            // TRAVA DE SEGURANÇA: Se tiver erro na tela, não envia!
            if (blocoRm.classList.contains('com-erro') || blocoEmail.classList.contains('com-erro')) {
                alert('Por favor, corrija os campos em destaque antes de enviar.');
                return; // O 'return' cancela a execução do resto do código
            }

            // Captura os serviços marcados (Checkboxes)
            const checkboxesServicos = document.querySelectorAll('input[name="servico"]:checked');
            const servicosSelecionados = Array.from(checkboxesServicos).map(cb => cb.value).join(', ');

            if (servicosSelecionados === '') {
                alert('Selecione pelo menos um serviço (Levantamento Bibliográfico ou Normalização ABNT).');
                return;
            }

            // Monta o pacote JSON para o Back-end
            const dadosDoAluno = {
                rm: inputRm.value,
                nome: document.getElementById('nome').value,
                email: inputEmail.value,
                curso: document.getElementById('curso').value,
                servico: servicosSelecionados,
                data: document.getElementById('data').value,
                horario: document.getElementById('horario').value
            };

            // Envia para o servidor Node.js
            try {
                // A porta 3000 é onde o Back-end dos seus colegas estará rodando
                const resposta = await fetch('http://localhost:3000/agendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosDoAluno)
                });

                if (resposta.ok) {
                    // Sucesso! Vai para a tela que criamos
                    window.location.href = 'confirmacao.html';
                } else {
                    alert('Erro ao agendar. Verifique os dados com a administração.');
                }
            } catch (erro) {
                console.error('Erro de conexão:', erro);
                alert('O servidor da biblioteca parece estar offline. Tente novamente mais tarde.');
            }
        });
    }
});
