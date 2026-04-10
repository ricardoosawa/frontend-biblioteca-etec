// Esse código roda imediatamente antes da página carregar o visual
async function verificarAcesso() {
    // 1. Pega o crachá no bolso do navegador
    const token = localStorage.getItem('token');

    // Se não tem crachá, chuta de volta pro login na hora
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Se tem crachá, pergunta para o servidor se ele ainda é válido (não expirou)
    try {
        const resposta = await fetch('http://localhost:3000/api/v1/auth/me', {
            method: 'GET',
            headers: {
                // É assim que enviamos o crachá para o back-end confirmar
                'Authorization': `Bearer ${token}` 
            }
        });

        // Se o servidor recusar o crachá (expirado ou falso)
        if (!resposta.ok) {
            localStorage.removeItem('token'); // Joga o crachá falso fora
            window.location.href = 'login.html';
        }
        // Se a resposta for OK, o script permite a página carregar normalmente.

    } catch (erro) {
        console.error("Erro de conexão ao verificar token:", erro);
    }
}

// Executa a função de proteção
verificarAcesso();
