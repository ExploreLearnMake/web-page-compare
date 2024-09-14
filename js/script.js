// this script will collect the content from two web pages and compare them to determine if they are identical. If they are different, the script will highlight the differences in red and green. The script will also display the comparison result on the page.

document.getElementById('compareButton').addEventListener('click', async function() {
  // get the urls from the form fields
  const url1 = document.getElementById('url1').value;
  const url2 = document.getElementById('url2').value;

  // fetch the content of the two web pages
  async function fetchContent(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return Array.from(doc.body.querySelectorAll('*'))
      .filter(el => el.textContent.trim() !== '')
      .map(el => el.textContent.trim())
      .join(' ');
  }

  const content1 = await fetchContent(url1);
  const content2 = await fetchContent(url2);

  // compare the content of the two web pages
  function compareContent(content1, content2) {
    const diff = Diff.diffWords(content1, content2);
    const result1 = document.getElementById('content1');
    const result2 = document.getElementById('content2');

    result1.innerHTML = '';
    result2.innerHTML = '';

    diff.forEach(part => {
      const span = document.createElement('span');
      if (part.added) {
        span.classList.add('added-item');
        span.textContent = part.value;
        result2.appendChild(span);
      } else if (part.removed) {
        span.classList.add('removed-item');
        span.textContent = part.value;
        result1.appendChild(span);
      } else if (part.modified) {
        span.classList.add('modified-item');
        span.textContent = part.value;
        result1.appendChild(span.cloneNode(true));
        result2.appendChild(span);
      } else {
        span.textContent = part.value;
        result1.appendChild(span.cloneNode(true));
        result2.appendChild(span);
      }
    });
  }

  compareContent(content1, content2);
});