document.addEventListener('DOMContentLoaded', () => {
    
    const corpoTabela = document.querySelector('tbody');
    const token = localStorage.getItem('token');

    async function carregarAgendamentos() {
        try {

            const resposta = await fetch('http://localhost:3000/api/v1/agendamentos?limit=50', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (resposta.ok) {
                const pacoteDoServidor = await resposta.json();
                
                // O nosso fofoqueiro anota no F12 exatamente como o pacote chegou
                console.log("Pacote recebido do servidor:", pacoteDoServidor);

                // O nosso caçador de listas: procura onde a lista (Array) está guardada
                let listaReal = [];
                
                if (Array.isArray(pacoteDoServidor)) {
                    listaReal = pacoteDoServidor; // A lista veio solta
                } else if (pacoteDoServidor.data && Array.isArray(pacoteDoServidor.data)) {
                    listaReal = pacoteDoServidor.data; // A lista estava na gaveta 'data'
                } else if (pacoteDoServidor.data && Array.isArray(pacoteDoServidor.data.agendamentos)) {
                    listaReal = pacoteDoServidor.data.agendamentos; // A lista estava na sub-gaveta
                }

                // Entrega a verdadeira lista para a tabela desenhar!
                desenharTabela(listaReal);

            } else {
                const motivo = await resposta.text();
                alert(`O servidor recusou a lista! Erro ${resposta.status}: ` + motivo);
                corpoTabela.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red;">Erro ${resposta.status}: Verifique o alerta.</td></tr>`;
            }
        } catch (erro) {
            console.error('Erro ao buscar dados:', erro);
            corpoTabela.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Servidor offline.</td></tr>';
        }
    }

    function desenharTabela(agendamentos) {
        corpoTabela.innerHTML = ''; // Limpa a tabela

        if (agendamentos.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="8" style="text-align: center;">Nenhum agendamento pendente no momento.</td></tr>';
            return;
        }

        agendamentos.forEach(agendamento => {
            // LÓGICA PARA TRANSFORMAR OS BOOLEANOS EM TEXTO:
            let servicosMarcados = [];
            if (agendamento.servico_levantamento) servicosMarcados.push('Levantamento');
            if (agendamento.servico_normalizacao) servicosMarcados.push('Normalização');
            
            // Se por acaso os dois estiverem falsos, mostra "Não informado"
            const textoExibicao = servicosMarcados.length > 0 
                ? servicosMarcados.join(' + ') 
                : 'Não informado';

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${agendamento.rm || 'N/A'}</td>
                <td>${agendamento.nome}</td>
                <td>${agendamento.email}</td>
                <td>${textoExibicao}</td> 
                <td>${agendamento.data}</td>
                <td>${agendamento.horario}</td>
                <td><span class="status-pendente">Pendente</span></td>
                <td class="acoes">
                    <button class="btn-aprovar" title="Aprovar">✓</button>
                    <button class="btn-recusar" title="Recusar">✕</button>
                </td>
            `;
            corpoTabela.appendChild(linha);
        });
    }

    carregarAgendamentos();
});