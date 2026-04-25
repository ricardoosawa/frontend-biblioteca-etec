document.addEventListener('DOMContentLoaded', () => {
    
    const corpoTabela = document.querySelector('tbody');
    const token = localStorage.getItem('token');

    // === TRAVA DE SEGURANÇA CONTRA INTRUSOS ===
    if (!token) {
        window.location.href = 'login.html';
        return; // Faz o JavaScript parar a leitura da página aqui mesmo
    }
    // ==========================================

    async function carregarAgendamentos() {
        // ... resto do seu código ...
        try {
            const resposta = await fetch('http://localhost:3000/api/v1/agendamentos?limit=50', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (resposta.ok) {
                const pacoteDoServidor = await resposta.json();
                console.log("Pacote recebido do servidor:", pacoteDoServidor);

                let listaReal = [];
                if (Array.isArray(pacoteDoServidor)) {
                    listaReal = pacoteDoServidor;
                } else if (pacoteDoServidor.data && Array.isArray(pacoteDoServidor.data)) {
                    listaReal = pacoteDoServidor.data;
                } else if (pacoteDoServidor.data && Array.isArray(pacoteDoServidor.data.agendamentos)) {
                    listaReal = pacoteDoServidor.data.agendamentos;
                }

                desenharTabela(listaReal);

            } else {
                const motivo = await resposta.text();
                alert(`O servidor recusou a lista! Erro ${resposta.status}: ` + motivo);
                corpoTabela.innerHTML = `<tr><td colspan="9" style="text-align: center; color: red;">Erro ${resposta.status}: Verifique o alerta.</td></tr>`;
            }
        } catch (erro) {
            console.error('Erro ao buscar dados:', erro);
            corpoTabela.innerHTML = '<tr><td colspan="9" style="text-align: center; color: red;">Servidor offline.</td></tr>';
        }
    }

    function desenharTabela(agendamentos) {
        corpoTabela.innerHTML = ''; 

        if (agendamentos.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="9" style="text-align: center;">Nenhum agendamento pendente no momento.</td></tr>';
            return;
        }

        agendamentos.forEach(agendamento => {
            let servicosMarcados = [];
            if (agendamento.servico_levantamento) servicosMarcados.push('Levantamento');
            if (agendamento.servico_normalizacao) servicosMarcados.push('Normalização');
            
            const textoExibicao = servicosMarcados.length > 0 
                ? servicosMarcados.join(' + ') 
                : 'Não informado';

            // Criamos a URL dinâmica para a página de detalhes
            const urlAgendamento = `agendamento.html?id=${agendamento.id}`;

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${agendamento.rm || 'N/A'}</td>
                <td>${agendamento.nome}</td>
                <td>${agendamento.curso || 'Não informado'}</td> 
                <td>${agendamento.email}</td>
                <td>${textoExibicao}</td> 
                <td>${agendamento.data}</td>
                <td>${agendamento.horario}</td>
                <td><span class="status-${agendamento.status.toLowerCase()}">${agendamento.status}</span></td>
                <td class="acoes">
                    <a href="${urlAgendamento}" class="btn-detalhes" title="Ver Detalhes" style="text-decoration: none; margin-right: 8px;">🔍</a>
                    
                    <button class="btn-aprovar" title="Aprovar" onclick="alterarStatus(${agendamento.id}, 'APROVADO')">✓</button>
                    <button class="btn-recusar" title="Recusar" onclick="alterarStatus(${agendamento.id}, 'RECUSADO')">✕</button>
                </td>
            `;
            corpoTabela.appendChild(linha);
        });
    }

    window.alterarStatus = async function(id, novoStatus) {
        const confirmacao = confirm(`Tem certeza que deseja marcar este agendamento como ${novoStatus}?`);
        if (!confirmacao) return;

        try {
            const resposta = await fetch(`http://localhost:3000/api/v1/agendamentos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: novoStatus })
            });

            if (resposta.ok) {
                carregarAgendamentos();
            } else {
                const motivo = await resposta.text();
                alert(`Erro ao alterar o status! Servidor disse: ` + motivo);
            }
        } catch (erro) {
            console.error('Erro de conexão:', erro);
            alert('Não foi possível conectar ao servidor.');
        }
    };

    carregarAgendamentos();
});

window.logout = function() {
    if (confirm("Deseja realmente sair do sistema?")) {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
};