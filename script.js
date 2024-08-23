var apiKey = "RGAPI-20799cb0-975e-4441-b40a-633c5897aa9e"; 
function getSummonerInfo() {
    var username = document.getElementById("username").value;

    // Faz a requisição para a API Summoner-V4 para obter informações básicas do summoner
    fetch(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Faz a requisição para a API League-V4 para obter informações de ranked
            fetch(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(leagueData => {
              
                    // Cria um novo card com as informações do summoner e ranked
                    var card = createSummonerCard(data, leagueData);

                    // Adiciona o card ao contêiner de resultados
                    var resultContainer = document.getElementById("result");
                    resultContainer.appendChild(card);

                    // Limpa o campo de busca
                    document.getElementById("username").value = "";
                })
                .catch(error => {
                    console.log("Ocorreu um erro ao obter as informações de ranked:", error);
                    alert("Ocorreu um erro ao obter as informações de ranked:");
                });
        })
        .catch(error => {
            console.log("Ocorreu um erro ao obter as informações do summoner:", error);
            alert("Ocorreu um erro ao obter as informações do summoner:");
        });
}

function createSummonerCard(summonerData, rankedData) {
    // Cria o elemento de card
    var card = document.createElement("div");
    card.classList.add("card");

    // Cria o conteúdo do card com as informações do summoner e ranked
    card.innerHTML = `
        <h2>${summonerData.name}</h2>
        <p><strong>Nível:</strong> ${summonerData.summonerLevel}</p>
        <img src="http://ddragon.leagueoflegends.com/cdn/11.11.1/img/profileicon/${summonerData.profileIconId}.png" alt="Ícone de Perfil" width="100" height="100">
        <p><strong>Classificação:</strong> ${getRankedInfo(rankedData)}</p>
        <p><strong>Winrate Total:</strong> ${calculateWinrate(rankedData[0].wins, rankedData[0].losses)}%</p>
        <p><strong>Vitórias:</strong> ${rankedData[0].wins}</p>
        <p><strong>Derrotas:</strong> ${rankedData[0].losses}</p>
    `;
    // Adiciona o botão para remover o card
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", function() {
        card.remove();
    });
    card.appendChild(removeButton);

    return card;
}

function getRankedInfo(rankedData) {
    if (rankedData.length > 0) {
        var entry = rankedData[0];
        return `${entry.tier} ${entry.rank} (${entry.leaguePoints} LP)`;
    }
    return "Não classificado";
}

function calculateWinrate(wins, losses) {
    var totalMatches = wins + losses;
    if (totalMatches === 0) {
        return "N/A";
    }
    var winrate = (wins / totalMatches) * 100;
    return winrate.toFixed(2);
}









