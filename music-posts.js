// ============================================
// MUSIC POSTS
// ============================================

// Load music posts when page loads
window.addEventListener('load', function () {
  console.log('Loading music posts...');
  loadMusicPosts();
});

function loadMusicPosts() {
  const musicPosts = JSON.parse(localStorage.getItem('musicPosts')) || [];
  console.log('Found music posts:', musicPosts.length);
  musicPosts.forEach(post => renderMusicPost(post, false));
}

// Load music posts when page loads
window.addEventListener('load', function () {
  console.log('Loading music posts...');
  loadMusicPosts();
});

function loadMusicPosts() {
  const musicPosts = JSON.parse(localStorage.getItem('musicPosts')) || [];
  console.log('Found music posts:', musicPosts.length);
  musicPosts.forEach(post => renderMusicPost(post, false));
}

function addMusicPost() {
  console.log('Adding music post...');
  const title = document.getElementById('musicTitle').value.trim();
  const content = document.getElementById('musicContent').value.trim();
  const emailInput = document.getElementById('musicEmail').value.trim();
  const imageInput = document.getElementById('musicImage');
  const imageFile = imageInput ? imageInput.files[0] : null;

  if (!title || !content) {
    alert('Please enter both a title and content for your music post.');
    return;
  }

  const timestamp = new Date().toLocaleString();
  const isNumericOverride = /^\d+$/.test(emailInput);
  const crmValue = isNumericOverride ? emailInput : null;
  const emailToDisplay = isNumericOverride ? null : emailInput;

  const postData = {
    title,
    content,
    image: null,
    timestamp,
    crm: crmValue,
    email: emailToDisplay
  };

  if (imageFile) {
    console.log('Reading music image:', imageFile.name, 'Size:', imageFile.size);
    const reader = new FileReader();
    reader.onload = function (e) {
      console.log('Music image loaded successfully, data length:', e.target.result.length);
      postData.image = e.target.result;
      saveAndRenderMusicPost(postData);
      clearMusicInputs(); // Clear AFTER image is loaded
    };
    reader.onerror = function (err) {
      console.error("❌ Music image read error:", err);
      alert("There was an error reading the image. Please try a smaller image.");
    };
    reader.readAsDataURL(imageFile);
  } else {
    console.log('No image selected');
    saveAndRenderMusicPost(postData);
    clearMusicInputs();
  }
}

function clearMusicInputs() {
  const elements = ['musicTitle', 'musicContent', 'musicEmail', 'musicImage'];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function saveAndRenderMusicPost(post) {
  const savedPosts = JSON.parse(localStorage.getItem('musicPosts')) || [];
  savedPosts.unshift(post);
  localStorage.setItem('musicPosts', JSON.stringify(savedPosts));
  console.log('Music post saved');
  renderMusicPost(post, true);
}

function renderMusicPost(post, insertAtTop = false) {
  const container = document.getElementById('musicPostsContainer');
  if (!container) {
    console.error('musicPostsContainer not found');
    return;
  }

  const postSection = document.createElement('section');
  postSection.style.borderBottom = '1px solid #ccc';
  postSection.style.padding = '10px 0';
  postSection.style.overflow = 'hidden';

  if (post.image) {
    console.log('Rendering music post with image');
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = "User uploaded music image";
    img.style.float = "right";
    img.style.marginLeft = "20px";
    img.style.marginBottom = "10px";
    img.style.width = "200px";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    postSection.appendChild(img);
  }

  const postTitle = document.createElement('h2');
  postTitle.textContent = post.title;

  const postText = document.createElement('p');
  postText.textContent = post.content;

  const postTime = document.createElement('small');
  postTime.textContent = `Posted on ${post.timestamp}`;
  postTime.style.display = 'block';
  postTime.style.marginTop = '5px';
  postTime.style.color = '#666';

  if (post.email && !/^\d+$/.test(post.email)) {
    const emailTag = document.createElement('small');
    emailTag.textContent = `Email: ${post.email}`;
    emailTag.style.display = 'block';
    emailTag.style.color = '#444';
    emailTag.style.marginBottom = '5px';
    postSection.appendChild(emailTag);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Music Post';
  deleteBtn.style.marginTop = '10px';
  deleteBtn.style.padding = '5px 10px';
  deleteBtn.onclick = function () {
    postSection.remove();
    deleteMusicPost(post);
  };

  postSection.appendChild(postTitle);
  postSection.appendChild(postText);
  postSection.appendChild(postTime);
  postSection.appendChild(deleteBtn);

  if (insertAtTop) {
    container.insertBefore(postSection, container.firstChild);
  } else {
    container.appendChild(postSection);
  }
}

function deleteMusicPost(targetPost) {
  let savedPosts = JSON.parse(localStorage.getItem('musicPosts')) || [];
  savedPosts = savedPosts.filter(post =>
    !(post.title === targetPost.title &&
      post.content === targetPost.content &&
      post.timestamp === targetPost.timestamp)
  );
  localStorage.setItem('musicPosts', JSON.stringify(savedPosts));
  console.log('Music post deleted');
}
