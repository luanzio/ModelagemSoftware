document.addEventListener('DOMContentLoaded', function () {
  const formInitial = document.getElementById('form-initial');
  const formQuestions = document.getElementById('form-questions');
  const questionList = document.getElementById('question-list');
  const resultButton = document.getElementById('result-button');
  const resultScreen = document.getElementById('result-screen');
  const resultText = document.getElementById('result-text');
  const backButton = document.getElementById('back-button');
  const colorsDiv = document.getElementById('colorsDiv');
  const removeForm = document.getElementById('remove-form');
  const removeFormContainer = document.getElementById('remove-form-container');
  const btnVerDiagnostico = document.getElementById('btnVerDiagnostico');


  formInitial.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value;
    const consent = document.getElementById('consent').checked;
  
    if (!consent) {
      alert('É necessário autorizar o uso dos dados.');
      return;
    }
  
    const userData = {
      name: name,
      cpf: cpf
    };
  
    localStorage.setItem('userData', JSON.stringify(userData));
  
    const nameElement = document.getElementById('user-name');
    nameElement.textContent = name;

    divDiagnostico.style.display = 'none';  
    removeFormContainer.style.display = 'none';
    btnVerDiagnostico.style.display = 'none';

    showQuestionScreen();
  
    const subtitleElement = document.getElementById('subtitle');
    subtitleElement.style.display = 'none';    
    
  });

  removeForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const removeName = document.getElementById('remove-name').value;
    const removeCpf = document.getElementById('remove-cpf').value;
    
    // Formatar o CPF removendo pontos e traços
    const formattedCpf = removeCpf.replace(/\D/g, '');
  
    let colors = localStorage.getItem('colors');
    if (colors) {
      colors = JSON.parse(colors);
  
      const index = colors.findIndex(data => {
        const [name, cpf] = data.split(' ');
        const formattedSavedCpf = cpf.replace(/\D/g, ''); // Formatar CPF armazenado
  
        return name === removeName && formattedSavedCpf === formattedCpf;
      });
  
      if (index !== -1) {
        // remover o diagnóstico
        colors.splice(index, 1);
        localStorage.setItem('colors', JSON.stringify(colors));
        alert('Diagnóstico removido com sucesso.');
        location.reload();
      } else {
        alert('Não foi encontrado nenhum diagnóstico com o nome e CPF informados.');
      }
    } else {
      alert('Não existem diagnósticos salvos no localStorage.');
    }
  
    removeForm.reset();
  });
  

  function showQuestionScreen() {

    
    formInitial.style.display = 'none';
    formQuestions.style.display = 'block';

    const questions = [
      'Você sente febre?',
      'Você sente falta de ar?',
      'Você tem tosse?',
      'Você tem espirros?',
      'Você sente dores no corpo?',
      'Você tem mal-estar?',
      'Você tem coriza?',
      'Você sente dor de garganta?',
      'Você tem diarreia?',
      'Você sente dor de cabeça?',
      'Você sente cansaço?',
      'Você sente calafrios?',
      'Você tem perda de olfato?',
      'Você tem perda de paladar?'
    ];

    questionList.innerHTML = '';

    questions.forEach(function (question, index) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
      <span id="question-title">${question}</span>
        <label>
          <input type="radio" name="question${index}" value="sim" required> Sim
        <label>
          <input type="radio" name="question${index}" value="nao" required> Não
        </label>

      `;
      questionList.appendChild(listItem);
    });

    resultButton.addEventListener('click', function () {
      const answers = Array.from(document.querySelectorAll('input[name^="question"]:checked'));
      const simCount = answers.filter(answer => answer.value === 'sim').length;
      const totalQuestions = 14;

      if (answers.length !== totalQuestions) {
        alert('Por favor, responda todas as perguntas.');
        return;
      }

      if (simCount >= 10) {
        resultText.innerHTML = '<span style="color: #fff"> Situação:</span> <span style="color: red;">Grave risco, procure um médico!</span>';
        saveColor('grave');
      } else if (simCount >= 5 && simCount <= 9) {
        resultText.innerHTML = '<span style="color: #fff"> Situação:</span>  <span style="color: yellow;">Médio risco, continue usando máscara!</span>';
        saveColor('médio');
      } else {
        resultText.innerHTML = '<span style="color: #fff"> Situação:</span>  <span style="color: green;">Baixo risco, fique atento a novos sintomas.</span>';
        saveColor('baixo');
      }
      
      function saveColor(color) {
        const name = document.getElementById('name').value;
        const cpf = document.getElementById('cpf').value;
      
        // ve se já existe no localStorage
        let colors = localStorage.getItem('colors');
        if (colors) {
          colors = JSON.parse(colors);
        } else {
          colors = [];
        }
      
        const userData = `${name} ${cpf} ${color}`;
        colors.push(userData);
      

        localStorage.setItem('colors', JSON.stringify(colors));
      }
      
      
      // exibir as cores salvas em outra div
           
    

      formQuestions.style.display = 'none';
      resultScreen.style.display = 'block';

      // chama a função para exibir as cores
      displayColors();

    });
  }


  function displayColors() {
    let colors = localStorage.getItem('colors');
    if (colors) {
      colors = JSON.parse(colors);
  
      // ve se há dados no array 
      if (colors.length === 0) {
        let span = document.createElement('span');
        span.textContent = "Não há diagnósticos cadastrados";
        colorsDiv.appendChild(span);
      } else {

        for (let index = 0; index < colors.length; index++) {
          let colorData = colors[index];
          const elements = colorData.split(' ');
          if (elements.length >= 3) {
            const color = elements[2];
            let span = document.createElement('span');
            span.style.color = color;
            span.textContent = `${index + 1}. ${color.toUpperCase()}`;
            colorsDiv.appendChild(span);
            colorsDiv.appendChild(document.createElement('br'));
          }
        }
      }
    } else {
      let span = document.createElement('span');
      span.textContent = "Não há diagnósticos cadastrados";
      colorsDiv.appendChild(span);
    }
  }
  
  
  

  displayColors();

  backButton.addEventListener('click', function () {
    resultScreen.style.display = 'none';
    location.reload();
  });
});