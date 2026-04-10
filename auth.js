document.addEventListener('DOMContentLoaded', async () => {
    const loadingStatus = document.getElementById('loadingStatus');
    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');

    
    // 1. Verifica o status do sistema (Se já tem admin cadastrado)
    try {
        const respostaStatus = await fetch('http://localhost:3000/api/v1/auth/status');
        const dadosStatus = await respostaStatus.json();
        
        // Vamos imprimir a fofoca no F12 para você mandar pro seu colega depois
        console.log("O backend respondeu no status:", dadosStatus);

        loadingStatus.style.display = 'none'; 

        // DESVIO DE TESTE: Vamos forçar a tela de login a aparecer 
        // para você conseguir testar a sua entrada!
        formLogin.style.display = 'block';
        formRegistro.style.display = 'none';
        
    } catch (erro) {
        console.error("Erro ao verificar status:", erro);
        loadingStatus.innerHTML = "<p style='color: red;'>Erro ao conectar com o servidor.</p>";
    }

    // 2. Lógica de envio do Login
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('emailLogin').value;
            const senha = document.getElementById('senhaLogin').value;

            try {
                const res = await fetch('http://localhost:3000/api/v1/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Ajustado para 'password' conforme esperado pelo back-end
                    body: JSON.stringify({ email: email, password: senha }) 
                });

                if (res.ok) {
                    const dados = await res.json();
                    localStorage.setItem('token', dados.data.token);
                    window.location.href = 'painel.html';
                } else {
                    const motivoDoErro = await res.text();
                    alert('O servidor recusou o login dizendo: ' + motivoDoErro);
                    console.log("Erro no login:", motivoDoErro);
                }
            } catch (erro) {
                alert('Erro ao conectar com o servidor.');
            }
        });
    }

    // 3. Lógica de envio do Registro (1º Acesso)
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nomeRegistro').value;
            const email = document.getElementById('emailRegistro').value;
            const senha = document.getElementById('senhaRegistro').value;
            const senhaConfirm = document.getElementById('senhaRegistroConfirm').value;

            // Trava do Front-end: Senhas iguais?
            if (senha !== senhaConfirm) {
                alert("As senhas não coincidem! Digite novamente.");
                return; // Para tudo e não envia
            }

            try {
                const res = await fetch('http://localhost:3000/api/v1/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviando as chaves em inglês conforme exigido pelo servidor
                    body: JSON.stringify({ 
                        nome: nome, 
                        email: email, 
                        password: senha, 
                        passwordConfirm: senhaConfirm 
                    })
                });

                if (res.ok) {
                    alert('Administrador criado com sucesso! Faça o login agora.');
                    // Esconde o registro e mostra o login
                    formRegistro.style.display = 'none';
                    formLogin.style.display = 'block';
                    // Opcional: limpa o e-mail preenchido no login para o usuário
                    document.getElementById('emailLogin').value = email;
                } else {
                    // Pega a resposta exata do Back-end e joga na tela
                    const motivoDoErro = await res.text();
                    alert('O servidor respondeu: ' + motivoDoErro);
                    console.log("Detalhes do erro:", motivoDoErro);
                }
            } catch (erro) {
                alert('Erro ao conectar com o servidor.');
            }
        });
    }
}); 