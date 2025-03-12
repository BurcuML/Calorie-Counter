const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

/*Bu kod, verilen bir string'deki (str) "+" (artı), "-" (eksi) ve boşluk karakterlerini temizleyerek (kaldırarak) yeni bir string döndürüyor. 
Düzenli ifade (regex) kullanarak bu karakterleri buluyor ve .replace() metodu ile bunları boş string ile değiştiriyor.*/
function cleanInputString(str) { 
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

/*
Bu kod, verilen bir string'in (str) içinde bilimsel notasyon formatında bir sayı (örneğin "1e10", "2.5e-5") olup olmadığını kontrol ediyor.
"\d+": Bir veya daha fazla rakam (0-9) anlamına gelir.
"e": Küçük veya büyük 'e' harfi (bilimsel notasyonun göstergesi).
"\d+": Yine, bir veya daha fazla rakam.
"/i": Bu bayrak (flag) düzenli ifadenin büyük/küçük harf duyarsız (case-insensitive) olmasını sağlar. Yani "e" yerine "E" de olabilir.
*/
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function calculateCalories(e) {
  e.preventDefault(); // JavaScript'te bir olay nesnesi (event object) üzerinde çağrılan bir metottur ve tarayıcının varsayılan davranışını engellemek için kullanılır.
/*
Örneğin:
Form gönderme: Bir <form> elemanının varsayılan davranışı, verileri sunucuya göndermek ve sayfayı yenilemektir. 
e.preventDefault() kullanarak bu davranışı engelleyebilir ve veriyi JavaScript ile (örneğin AJAX kullanarak) gönderebilirsiniz.*/
  
  isError = false;

  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return;
  }

  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton .addEventListener("click", clearForm);
