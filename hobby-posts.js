// ============================================
// HOBBY POSTS
// ============================================

// Load hobby posts when page loads
window.addEventListener('load', function () {
  console.log('Loading hobby posts...');
  loadHobbyPosts();
});

function loadHobbyPosts() {
  const hobbyPosts = JSON.parse(localStorage.getItem('hobbyPosts')) || [];
  console.log('Found hobby posts:', hobbyPosts.length);
  hobbyPosts.forEach(post => renderPost(post, false));
}

function addPost() {
  console.log('Adding hobby post...');
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const emailInput = document.getElementById('postEmail').value.trim();
  const imageInput = document.getElementById('postImage');
  const imageFile = imageInput ? imageInput.files[0] : null;

  if (!title || !content) {
    alert('Please enter both a title and content for your post.');
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
    console.log('Reading hobby image:', imageFile.name, 'Size:', imageFile.size);
    const reader = new FileReader();
    reader.onload = function (e) {
      console.log('Hobby image loaded successfully, data length:', e.target.result.length);
      postData.image = e.target.result;
      saveAndRenderPost(postData);
      clearInputs(); // Clear AFTER image is loaded
    };
    reader.onerror = function (err) {
      console.error("❌ Hobby image read error:", err);
      alert("There was an error reading the image. Please try a smaller image.");
    };
    reader.readAsDataURL(imageFile);
  } else {
    console.log('No image selected');
    saveAndRenderPost(postData);
    clearInputs();
  }
}

function clearInputs() {
  const elements = ['postTitle', 'postContent', 'postEmail', 'postImage'];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function saveAndRenderPost(post) {
  const savedPosts = JSON.parse(localStorage.getItem('hobbyPosts')) || [];
  savedPosts.unshift(post);
  localStorage.setItem('hobbyPosts', JSON.stringify(savedPosts));
  console.log('Hobby post saved');
  renderPost(post, true);
}

function renderPost(post, insertAtTop = false) {
  const container = document.getElementById('postsContainer');
  if (!container) {
    console.error('postsContainer not found');
    return;
  }

  const postSection = document.createElement('section');
  postSection.style.borderBottom = '1px solid #ccc';
  postSection.style.padding = '10px 0';
  postSection.style.overflow = 'hidden';

  if (post.image) {
    console.log('Rendering hobby post with image');
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = "User uploaded image";
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
  deleteBtn.textContent = 'Delete Post';
  deleteBtn.style.marginTop = '10px';
  deleteBtn.style.padding = '5px 10px';
  deleteBtn.onclick = function () {
    postSection.remove();
    deletePost(post);
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

function deletePost(targetPost) {
  let savedPosts = JSON.parse(localStorage.getItem('hobbyPosts')) || [];
  savedPosts = savedPosts.filter(post =>
    !(post.title === targetPost.title &&
      post.content === targetPost.content &&
      post.timestamp === targetPost.timestamp)
  );
  localStorage.setItem('hobbyPosts', JSON.stringify(savedPosts));
  console.log('Hobby post deleted');
}
