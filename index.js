window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  let verbs = [], timeUnits = [], prepositions = [], nouns = [];
  let r = getRandomInt(7, 20);
  const list = document.getElementById("list");

  function getRandomWord(arr, chancey) {
    if (chancey && Math.random() > 0.5) return "";
    let word = arr[getRandomInt(0,arr.length)];
    while (list.innerText.includes(word)) word = arr[getRandomInt(0,arr.length)];
    return word;
  }

  function typewrite() {
    if (r > 0) {
      let rword = words[getRandomInt(0, words.length)];
      while (poem.includes(rword)) rword = words[getRandomInt(0, words.length)];
      poem.push(rword);
      let wt = 0;
      rword.split("").forEach((l, index) => {
        setTimeout(() => {
          if (index == rword.length - 1) l += "&nbsp;";
          list.innerHTML += l;
          list.style.maxWidth = "50%";
        }, wt+=getRandomInt(75, 250));
      });
      r--;
    } else {
      clearInterval(int);
    }
  }
  
  // amazing corpora of words -- https://github.com/dariusk/corpora/tree/master/data/words
  fetch("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/units_of_time.json").then((file) => file.json()).then((d) => {
    timeUnits = d.formal_time_units.concat(d.informal_discrete_time_units).concat(d.informal_nondiscrete_time_units);
  });
  fetch ("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/verbs.json").then((file) => file.json()).then((d) => {
    verbs = d.verbs.map((item) => item.present);
  });
  fetch ("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/nouns.json").then((file) => file.json()).then((d) => {
    nouns = d.nouns;
  });
  fetch ("https://raw.githubusercontent.com/dariusk/corpora/master/data/words/prepositions.json").then((file) => file.json()).then((d) => {
    prepositions = d.prepositions;
  });

  let listLength = getRandomInt(0, 7);
  int = setInterval(() => {
    // typewrite();
    const li = document.createElement("li");
    let w = getRandomWord(timeUnits, true);
    li.innerHTML = `${getRandomWord(verbs)} ${getRandomWord(prepositions, true)} ${getRandomWord(nouns, true)} ${ w ? "in a " + w : " " }`;
    list.appendChild(li);
    listLength--;
    if (listLength < 0) clearInterval(int);
  }, 1200);
});