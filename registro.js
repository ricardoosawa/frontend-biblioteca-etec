document.addEventListener('DOMContentLoaded', async () => {
    const areaRegistro = document.getElementById('areaRegistro');
    const formRegistro = document.getElementById('formRegistro');
    const mensagemErro = document.getElementById('mensagemErro');

    // 1. A inteligência da Rota de Status (Decide se a tela fica em branco ou não)
    try {
        const respostaStatus = await fetch('http://localhost:3000/api/v1/auth/status');
        const dadosStatus = await respostaStatus.json();

        // Agora nós lemos exatamente a chave "inicializado" que o Back-end envia
if (dadosStatus.data && dadosStatus.data.inicializado === true) {
            alert('Atenção: O administrador já foi criado! Redirecionando para o login.');
            window.location.href = 'login.html';
            return;
        } else {
            // Se não tem admin, libera a tela de registro (Tira a tela branca!)
            areaRegistro.style.display = 'block';
        }
    } catch (erro) {
        console.error('Erro ao verificar status:', erro);
        mensagemErro.textContent = 'Erro ao conectar com o servidor.';
        mensagemErro.style.display = 'block';
        areaRegistro.style.display = 'block';
    }

    // 2. O Envio do Registro (Agora com a linguagem que o Back-end entende)
    formRegistro.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        // Nossa trava de segurança visual:
        if (senha !== confirmarSenha) {
            mensagemErro.textContent = 'As senhas não coincidem. Digite novamente!';
            mensagemErro.style.display = 'block';
            return;
        }

        try {
            const resposta = await fetch('http://localhost:3000/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nome: nome, 
                    email: email, 
                    password: senha, 
                    passwordConfirm: confirmarSenha 
                })
            });

            if (resposta.ok) {
                alert('Administrador criado com sucesso! Faça o seu login.');
                window.location.href = 'login.html';
            } else {
                const erroServidor = await resposta.text();
                mensagemErro.textContent = 'Erro ao criar conta: ' + erroServidor;
                mensagemErro.style.display = 'block';
            }
        } catch (erro) {
            mensagemErro.textContent = 'Servidor offline.';
            mensagemErro.style.display = 'block';
        }
    });
});