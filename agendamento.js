document.addEventListener('DOMContentLoaded', async () => {
    // Pega o ID na URL (ex: ?id=15)
    const parametros = new URLSearchParams(window.location.search);
    const agendamentoId = parametros.get('id');

    if (!agendamentoId) {
        alert("Nenhum agendamento selecionado!");
        window.location.href = 'painel.html';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/v1/agendamentos/${agendamentoId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resposta.ok) {
            const pacoteServidor = await resposta.json();
            const agendamento = pacoteServidor.data ? pacoteServidor.data : pacoteServidor;

            document.getElementById('detalheNome').textContent = agendamento.nome || 'Não informado';
            document.getElementById('detalheRM').textContent = agendamento.rm || 'N/A';
            document.getElementById('detalheCurso').textContent = agendamento.curso || 'Não informado';
            document.getElementById('detalheEmail').textContent = agendamento.email || 'Não informado';
            document.getElementById('detalheData').textContent = agendamento.data || 'Não informado';
            document.getElementById('detalheHorario').textContent = agendamento.horario || 'Não informado';
            document.getElementById('detalheStatus').textContent = agendamento.status || 'Não informado';

            let servicos = [];
            if (agendamento.servico_levantamento) servicos.push('Levantamento');
            if (agendamento.servico_normalizacao) servicos.push('Normalização');
            document.getElementById('detalheServicos').textContent = servicos.length > 0 ? servicos.join(' + ') : 'Nenhum';
        } else {
            document.getElementById('areaDados').innerHTML = '<p style="color:red;">Agendamento não encontrado.</p>';
        }
    } catch (erro) {
        document.getElementById('areaDados').innerHTML = '<p style="color:red;">Erro de conexão com o servidor.</p>';
    }
});