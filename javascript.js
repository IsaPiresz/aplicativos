// Banco simbólico inicial base (pode ser personalizado e extendido)
const defaultSymbols = [
    { text: "Quero Comer", img: "https://cdn-icons-png.flaticon.com/512/1046/1046870.png" },
    { text: "Estou Triste", img: "https://cdn-icons-png.flaticon.com/512/247/247223.png" },
    { text: "Fazer Xixi", img: "https://cdn-icons-png.flaticon.com/512/633/633759.png" },
    { text: "Brincar", img: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
    { text: "Ajuda", img: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png" },
    { text: "Água", img: "https://cdn-icons-png.flaticon.com/512/732/732190.png" },
    { text: "Dormir", img: "https://cdn-icons-png.flaticon.com/512/1488/1488430.png" },
    { text: "Obrigado", img: "https://cdn-icons-png.flaticon.com/512/57/57082.png" }
  ];
  
  let symbols = JSON.parse(localStorage.getItem("symbols")) || defaultSymbols;
  let message = [];
  const speechSynth = window.speechSynthesis;
  
  const symbolGrid = document.getElementById("symbol-grid");
  const constructedMessageDiv = document.getElementById("constructed-message");
  const playSpeechBtn = document.getElementById("play-speech");
  const clearMessageBtn = document.getElementById("clear-message");
  const addSymbolForm = document.getElementById("add-symbol-form");
  const newSymbolTextInput = document.getElementById("new-symbol-text");
  const newSymbolUrlInput = document.getElementById("new-symbol-url");
  const suggestionList = document.getElementById("suggestion-list");
  
  // Renderiza os símbolos no grid
  function renderSymbols() {
    symbolGrid.innerHTML = "";
    symbols.forEach(({ text, img }, index) => {
      const div = document.createElement("div");
      div.className = "symbol-card";
      div.tabIndex = 0;
      div.setAttribute("role", "button");
      div.setAttribute("aria-label", text);
      div.innerHTML = `<img src="${img}" alt="${text}"/><span>${text}</span>`;
      div.addEventListener("click", () => addToMessage(text));
      div.addEventListener("keydown", e => {
        if(e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          addToMessage(text);
        }
      });
      symbolGrid.appendChild(div);
    });
  }
  
  // Adiciona palavra/símbolo à frase construída, atualiza tela e sugestões
  function addToMessage(text) {
    message.push(text);
    updateConstructedMessage();
    updateSuggestions();
  }
  
  // Atualiza frase montada na tela
  function updateConstructedMessage() {
    constructedMessageDiv.textContent = message.join(" ");
  }
  
  // Ouve a frase montada usando síntese de voz
  function speakMessage() {
    if(!message.length) return;
    if(speechSynth.speaking) speechSynth.cancel();
  
    const textToSpeak = message.join(" ");
    const utterThis = new SpeechSynthesisUtterance(textToSpeak);
    utterThis.lang = "pt-BR";
    speechSynth.speak(utterThis);
  }
  
  // Limpa a frase montada
  function clearMessage() {
    message = [];
    updateConstructedMessage();
    updateSuggestions();
  }
  
  // Sugere frases simples baseadas no histórico e contexto (exemplo simples)
  function updateSuggestions() {
    suggestionList.innerHTML = "";
  
    if (message.length === 0) return;
  
    // Frases pré definidas baseadas no conteúdo da mensagem
    // Exemplo simples: sugerir respostas ou opções complementares
    const lastWord = message[message.length - 1].toLowerCase();
    let suggestions = [];
  
    if(lastWord.includes("quero")) {
      suggestions = ["Quero água", "Quero brincar", "Quero comer"];
    } else if(lastWord.includes("triste")) {
      suggestions = ["Estou triste", "Quero abraço", "Preciso de ajuda"];
    } else if(lastWord.includes("ajuda")) {
      suggestions = ["Preciso de ajuda", "Alguém pode ajudar?", "Estou com medo"];
    }
  
    // Enchendo com algumas sugestões padrão se estiver vazio
    if(suggestions.length === 0){
      suggestions = ["Quero comer", "Estou feliz", "Quero ir ao banheiro"];
    }
  
    suggestions.forEach(suggestion => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.textContent = suggestion;
      li.addEventListener("click", () => {
        message = suggestion.split(" ");
        updateConstructedMessage();
        updateSuggestions();
      });
      li.addEventListener("keydown", e => {
        if(e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          message = suggestion.split(" ");
          updateConstructedMessage();
          updateSuggestions();
        }
      });
      suggestionList.appendChild(li);
    });
  }
  
  // Validação simples da URL (imagem)
  function isValidUrl(url) {
    try {
      new URL(url);
      return (url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null);
    } catch {
      return false;
    }
  }
  
  // Form adiciona novo símbolo personalizado
  addSymbolForm.addEventListener("submit", e => {
    e.preventDefault();
  
    const text = newSymbolTextInput.value.trim();
    const img = newSymbolUrlInput.value.trim();
  
    if(text.length < 2) {
      alert("Por favor, insira uma descrição válida.");
      return;
    }
    if(!isValidUrl(img)) {
      alert("Por favor, insira uma URL válida de uma imagem PNG, JPG, GIF ou SVG.");
      return;
    }
  
    symbols.push({ text, img });
    localStorage.setItem("symbols", JSON.stringify(symbols));
    renderSymbols();
    addSymbolForm.reset();
  });
  
  // Botões
  playSpeechBtn.addEventListener("click", speakMessage);
  clearMessageBtn.addEventListener("click", clearMessage);
  
  // Inicializações
  renderSymbols();
  updateSuggestions();
  updateConstructedMessage();
  