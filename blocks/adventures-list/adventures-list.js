/**
 * Loads the list of adventures.
 * @param {string} url The URL to an AEM persisted query providing the adventures
 * @returns {Document} The document
 */
async function fetchAdventures(url) {
  const resp = await fetch(url);
  if (resp.ok) {
    return await resp.json();
  }
  return {};
}

/**
 * @param {HTMLElement} $block The adventures list block element
 */
export default async function decorate($block) {
  // Get URL
  const link = $block.querySelector('a');
  const path = link ? link.getAttribute('href') : $block.textContent.trim();

  // Get content host
  const hostname = link.hostname;

  // Fetch adventures
  const json = await fetchAdventures(path);
  if (json && json.data && json.data.adventureList && json.data.adventureList.items) {
    const $ul = document.createElement('ul');
    var adventures = json.data.adventureList.items;
    adventures.forEach((adventure, index) => {
      // List item
      const $li = document.createElement('li');
      $li.className = 'cmp-image-list__item';

      // Article
      const $article = document.createElement('article');
      $article.className = 'cmp-image-list__item-content';
      // Thumbnail
      const $thumbnailDiv = document.createElement('div');
      $thumbnailDiv.className = 'cmp-image-list__item-image';
      const $thumbnail = document.createElement('img');
      $thumbnail.src = 'https://' + hostname + adventure.primaryImage['_dynamicUrl'];
      $thumbnail.alt = adventure.title;
      $thumbnail.className = 'cmp-image';
      $thumbnailDiv.appendChild($thumbnail);
      $article.appendChild($thumbnailDiv);
      // Title
      const $title = document.createElement('span');
      $title.className = 'cmp-image-list__item-title';
      $title.textContent = adventure.title;
      $article.appendChild($title);

      $li.appendChild($article);
      $ul.appendChild($li);
    });
    $block.replaceChildren($ul);
  } else {
    $block.innerHTML = '';
  }
}
