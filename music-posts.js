// ============================================
// MUSIC POSTS
// ============================================

// Load music posts when page loads
window.addEventListener('load', function () {
  console.log('Loading music posts...');
  loadMusicPosts();
});

function loadMusicPosts() {
  const posts = JSON.parse(localStorage.getItem('musicPosts')) || [];
  console.log('Loading music posts:', posts.length);
  posts.forEach(post => renderMusicPost(post, false));
}

function addMusicPost() {
  console.log('Add music post clicked');
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
    console.log('📷 Reading music image:', imageFile.name);
    const reader = new FileReader();
    reader.onload = function (e) {
      console.log('✅ Music image loaded!');
      postData.image = e.target.result;
      saveAndRenderMusicPost(postData);
      clearMusicInputs();
    };
    reader.onerror = function (err) {
      console.error("❌ Music image error:", err);
      alert("There was an error reading the image.");
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveAndRenderMusicPost(postData);
    clearMusicInputs();
  }
}

function clearMusicInputs() {
  document.getElementById('musicTitle').value = '';
  document.getElementById('musicContent').value = '';
  document.getElementById('musicEmail').value = '';
  document.getElementById('musicImage').value = '';
  console.log('✨ Music inputs cleared');
}

function saveAndRenderMusicPost(post) {
  const savedPosts = JSON.parse(localStorage.getItem('musicPosts')) || [];
  savedPosts.unshift(post);
  localStorage.setItem('musicPosts', JSON.stringify(savedPosts));
  renderMusicPost(post, true);
}

function renderMusicPost(post, insertAtTop = false) {
  const container = document.getElementById('musicPostsContainer');
  if (!container) return;

  const postSection = document.createElement('section');
  postSection.style.borderBottom = '1px solid #ccc';
  postSection.style.padding = '10px 0';
  postSection.style.overflow = 'hidden';
  postSection.style.marginBottom = '15px';

  if (post.image) {
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
}
