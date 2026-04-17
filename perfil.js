document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('token');
    
    // Se não tiver crachá, chuta de volta pro login
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const formPerfil = document.getElementById('formPerfil');
    const inputNome = document.getElementById('nomeAdmin');
    const inputEmail = document.getElementById('emailAdmin');

    // 1. Busca os dados atuais do bibliotecário assim que a página abre
    async function carregarDadosDoPerfil() {
        try {
            const resposta = await fetch('http://localhost:3000/api/v1/auth/me', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resposta.ok) {
                const pacote = await resposta.json();
                // Abre a gaveta certa (lembra do padrão do seu colega!)
                const dadosUsuario = pacote.data.user || pacote.data; 
                
                inputNome.value = dadosUsuario.nome;
                inputEmail.value = dadosUsuario.email;
            } else {
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = 'login.html';
            }
        } catch (erro) {
            console.error('Erro ao buscar perfil:', erro);
        }
    }

    // 2. Tenta salvar as alterações
    formPerfil.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Monta o pacote apenas com o que foi preenchido
        const dadosAtualizados = {
            nome: inputNome.value,
            email: inputEmail.value
        };

        const senhaAtual = document.getElementById('senhaAtual').value;
        const novaSenha = document.getElementById('novaSenha').value;

        // Só envia as senhas se o usuário digitou algo nelas
        if (senhaAtual || novaSenha) {
            dadosAtualizados.senhaAtual = senhaAtual;
            dadosAtualizados.novaSenha = novaSenha;
        }

        try {
            // Tentamos usar o padrão universal de atualização de cadastro (PATCH)
            const resposta = await fetch('http://localhost:3000/api/v1/auth/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (resposta.ok) {
                alert('Perfil atualizado com sucesso!');
                // Limpa os campos de senha
                document.getElementById('senhaAtual').value = '';
                document.getElementById('novaSenha').value = '';
            } else {
                // O NOSSO X9 EM AÇÃO:
                const motivo = await resposta.text();
                
                // Se der erro 404, significa que o seu colega ainda não criou a rota!
                if (resposta.status === 404) {
                    alert('Aviso: O seu Front-end está pronto, mas o Back-end ainda não possui a rota para atualizar o perfil. Avise seu colega!');
                } else {
                    alert(`O servidor recusou a alteração. Motivo: ` + motivo);
                }
            }
        } catch (erro) {
            alert('Erro de conexão com o servidor.');
        }
    });

    carregarDadosDoPerfil();
});