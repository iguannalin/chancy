window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  let verbs = [], timeUnits = [], prepositions = [], nouns = [];
  let r = getRandomInt(7, 20);
  const list = document.getElementById("list");

  function getRandomWord(arr, chancey = 0, isLabel = false) {
    if (chancey && Math.random() > chancey) return "";
    let word = arr[getRandomInt(0,arr.length)];
    while (list.innerText.includes(word)) word = arr[getRandomInt(0,arr.length)];
    word = word.replace(' ', '-');
    if (arr == timeUnits) {
      return '-' + (word.includes("in") ? word : word.includes("a ") ? ",-" + word : "in-a-" + word);
    }
    return isLabel ? word : ('-' + word);
  }

  function typewrite(sentence, t) {
    if (!sentence) return;
    console.log({sentence});
    let islandtime = 0;
    const li = document.createElement("li");
    sentence.split("").forEach((word) => {
      word.split(" ").forEach((letter) => {
        setTimeout(() => {
          if (letter == '-') li.innerHTML += "&nbsp;";
          else li.innerHTML += letter;
        }, islandtime = islandtime < t ? islandtime + getRandomInt(0,t/sentence.length) : 1);
      });
    });
    list.appendChild(li);
  }
  
  // amazing corpora of words -- https://github.com/dariusk/corpora/tree/master/data/words
  fetch("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/units_of_time.json").then((file) => file.json()).then((d) => {
    timeUnits = d.formal_time_units.concat(d.informal_discrete_time_units).concat(d.informal_nondiscrete_time_units);
  });
  fetch ("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/verbs.json").then((file) => file.json()).then((d) => {
    verbs = d.verbs.map((item) => item.present);
  });
  fetch ("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/prepositions.json").then((file) => file.json()).then((d) => {
    prepositions = d.prepositions;
  });
  fetch ("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/nouns.json").then((file) => file.json()).then((d) => {
    nouns = d.nouns;

    let listLength = getRandomInt(2, 9);
    const label = document.createElement("h1");
    label.innerHTML = `rules of ${getRandomWord(nouns, 0, true)}`;
    list.appendChild(label);

    const time = 1200;
    int = setInterval(() => {
      typewrite(`${getRandomWord(verbs)} ${getRandomWord(prepositions, 0.4)} ${getRandomWord(nouns, 0.4)} ${getRandomWord(timeUnits, 0.7)}`, time);
      listLength--;
      if (listLength < 0) clearInterval(int);
    }, time);
  });
});