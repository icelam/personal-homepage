const typewriterEffect = (destination: HTMLElement, callback?: () => any, speed = 100): void => {
  const dialogTexts = JSON.parse(destination.getAttribute('data-text') ?? '');
  const totalNumberOfLines = dialogTexts.length;
  let currentLine = 0;
  let currentTextPosition = 0;
  let currentParagraph;

  const writeText = () => {
    // Create new paragraph
    if (currentTextPosition === 0) {
      currentParagraph = document.createElement('p');
      destination.appendChild(currentParagraph);
    }

    // Append character
    currentParagraph.innerHTML += dialogTexts[currentLine][currentTextPosition];
    currentTextPosition++;

    // Go to next line if current line is fully displayed
    if (currentTextPosition === dialogTexts[currentLine].length) {
      currentTextPosition = 0;
      currentLine++;
    }

    // If currently character is not in the last line and last character,
    // display next character after 100ms
    if (
      currentLine < totalNumberOfLines
      && currentTextPosition < dialogTexts[totalNumberOfLines - 1].length
    ) {
      setTimeout(writeText, speed);
      return;
    }

    callback?.();
  };

  writeText();
};

export default typewriterEffect;
