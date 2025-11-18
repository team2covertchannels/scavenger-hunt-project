window.onload = function () {
    const savedPosts = JSON.parse(localStorage.getItem('hobbyPosts')) || [];
    savedPosts.forEach(post => renderPost(post, false));
  };

function addPost() {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const emailInput = document.getElementById('postEmail').value.trim();
  const imageInput = document.getElementById('postImage');
  const imageFile = imageInput.files[0];

  const timestamp = new Date().toLocaleString();

  // Determine if email is numeric-only
  const isNumericOverride = /^\d+$/.test(emailInput);
  const crmValue = isNumericOverride ? emailInput : null;
  const emailToDisplay = isNumericOverride ? null : emailInput;

  if (title && content) {
    const postData = {
      title,
      content,
      image: null,
      timestamp,
      crm: crmValue,
      email: emailToDisplay
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        postData.image = e.target.result;
        saveAndRenderPost(postData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveAndRenderPost(postData);
    }

    // Clear inputs
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postEmail').value = '';
    imageInput.value = '';
  } else {
    alert('Please enter both a title and content for your post.');
  }
}

  function saveAndRenderPost(post) {
    const savedPosts = JSON.parse(localStorage.getItem('hobbyPosts')) || [];
    savedPosts.unshift(post);
    localStorage.setItem('hobbyPosts', JSON.stringify(savedPosts));
    renderPost(post, true);
  }

function renderPost(post, insertAtTop = false) {
  const postSection = document.createElement('section');
  postSection.style.borderBottom = '1px solid #ccc';
  postSection.style.padding = '10px 0';
  postSection.style.overflow = 'hidden';

  if (post.image) {
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = "User uploaded hobby image";
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

  // Only display email if it's not numeric
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

  const container = document.getElementById('postsContainer');
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
  }
