  const mode = {
    normal: "normal",
    insert: "insert",
    visual: "visual",
    visual_line: "visual_line",
    visual_block: "visual_block"
  }


  // const action = {
  //   delete: "delete",
  //   yank: "yank",
  //   change: "change",
  //   find: "find",
  // }

  // const subject = {
  //   word: "word",
  //   back: "back",
  //   paragraph: "paragraph",
  // }

  const init_mode = mode.normal;

  function getMode() {
    const mode = window.localStorage.getItem("Chrome-VIM");
    return mode;
  }

  function setMode(newMode) {
    window.localStorage.setItem("Chrome-VIM", newMode);
  }

  window.localStorage.setItem("Chrome-VIM", init_mode);

  document.addEventListener("keydown", k => {

    const activeElement = document.activeElement;
    if (!activeElement) return;
    const element = document.getElementById(activeElement.id);

    if (getMode() === mode.normal) {
      k.preventDefault();
      switch (k.key) {
        case "w": handle_w(element)
        break

        case "i": setMode(mode.insert)
        break

        // case "W": handle_w()
        // break

        case "b": handle_b(element)
        break

        // case "B": handle_B()
        // break
      }
    }
    else if (getMode() === mode.insert) {
      if (k.key === "Escape") {
        k.preventDefault();
        setMode(mode.normal);
      }
    }
  });

  function handle_w(element) {
    const caretPosition = element.selectionStart;
    const textFromCursor = element.value.substring(caretPosition + 1);
    const textBehindCursor = element.value.substring(0, caretPosition + 1);

    const nonWord = String.raw`[^\w]`;
    const word = String.raw`\w`;

    let nextIndex = textFromCursor.search(nonWord);

    if (element.value[caretPosition].search(nonWord) !== -1) {
      const nextSpace = textFromCursor.search(" ");
      const nextAlphaNum = textFromCursor.search(word);
      if (nextSpace === -1 || nextAlphaNum === -1) {
        nextIndex = nextSpace === -1 ? nextAlphaNum : nextSpace;
      }
      else {
        nextIndex = Math.min(nextSpace, nextAlphaNum);
      }
    }

    while (textFromCursor[nextIndex] === " ") nextIndex++;
    element.setSelectionRange(textBehindCursor.length + nextIndex, textBehindCursor.length + nextIndex);
  }

  // function handle_W() {

  // }

  function handle_b(element) {
    const caretPosition = element.selectionStart;
    const textBehindCursorArr = element.value.substring(0, caretPosition).split("").reverse();
    const textBehindCursor = textBehindCursorArr.join("");
    console.log(textBehindCursor);

    // search for
    // word character followed by a non-word character
    // non word character followed by a word character
    // any character followed by a space
    // match lowest index

    const wordNonWord = String.raw`\w[^\w]`;
    const nonWordWord = String.raw`[^\w]\w`;
    const anyCharSpace = String.raw`.\s`;

    let i = textBehindCursor.search(wordNonWord);
    let j = textBehindCursor.search(nonWordWord);
    let k = textBehindCursor.search(anyCharSpace);

    let nextIndex = Math.min(i, j);
    nextIndex = Math.min(nextIndex, k);

    while (textBehindCursor[nextIndex] === " ") nextIndex++;
    element.setSelectionRange(textBehindCursor.length - 1 - nextIndex, textBehindCursor.length - 1 - nextIndex);
  }

  // function handle_B() {

  // }
