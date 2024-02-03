window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  // verbs = 0, timeUnits = 1, prepositions = 2, nouns = 3;
  let bank =[0,0,0,0];
  const list = document.getElementById("list");

  function getRandomWord(arr, chancey = 0, isLabel = false) {
    if (!arr || (chancey && Math.random() > chancey)) return "";
    let word = arr[getRandomInt(0,arr.length)];
    while (!word || list.innerText.includes(word)) word = arr[getRandomInt(0,arr.length)];
    word = word.replaceAll(' ', '-');
    if (arr == bank[0]) {
      return '-' + (word.includes("in") ? word : word.includes("a ") ? ",-" + word : word.includes("days") ? "in-" + word : "in-a-" + word);
    }
    return isLabel ? word : ('-' + word);
  }

  function typewrite(sentence, t) {
    if (!sentence) return;
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

  // const requests = urls.map((url) => fetch(url)); 
  // const responses = await Promise.all(requests); 
  // const promises = responses.map((response) => response.text());
  // return await Promise.all(promises);

  // amazing corpora of words -- https://github.com/dariusk/corpora/tree/master/data/words
  const urls = [
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/words/units_of_time.json",
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/words/verbs.json",
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/words/prepositions.json",
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/words/nouns.json"
  ];

  Promise.all(urls.map(u=>fetch(u))).then(responses =>
    Promise.all(responses.map(res => res.json()))
  ).then(bank => {
      // verbs = 0, timeUnits = 1, prepositions = 2, nouns = 3;
      bank[0] = bank[0].formal_time_units.concat(bank[0].informal_discrete_time_units).concat(bank[0].informal_nondiscrete_time_units);
      bank[1] = bank[1].verbs.map((item) => item.present);
      bank[2] = bank[2].prepositions;
      bank[3] = bank[3].nouns;

      let listLength = getRandomInt(2, 8);
      const label = document.createElement("h1");
      label.innerHTML = `rules of ${getRandomWord(bank[3], 0, true)}`;
      list.appendChild(label);
      
      const time = 1200;
      setInterval(typewrite(`${getRandomWord(bank[1])} ${getRandomWord(bank[2], 0.4)} ${getRandomWord(bank[3], 0.4)} ${getRandomWord(bank[0], 0.7)}`, time), 750);
      int = setInterval(() => {
        typewrite(`${getRandomWord(bank[1])} ${getRandomWord(bank[2], 0.4)} ${getRandomWord(bank[3], 0.4)} ${getRandomWord(bank[0], 0.7)}`, time);
        listLength--;
        if (listLength < 0) clearInterval(int);
      }, time);
  });
});