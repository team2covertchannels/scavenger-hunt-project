  // Load recommendation posts on page load
  window.addEventListener('load', function () {
    console.log('Loading saved posts...');
    const recommendationPosts = JSON.parse(localStorage.getItem('recommendationPosts')) || [];
    console.log('Found posts:', recommendationPosts.length);
    recommendationPosts.forEach(post => renderRecommendationPost(post, false));
  });

  function addRecommendationPost() {
    console.log('Add button clicked');
    
    const title = document.getElementById('recTitle').value.trim();
    const content = document.getElementById('recContent').value.trim();
    const emailInput = document.getElementById('recEmail').value.trim();
    const imageInput = document.getElementById('recImage');
    
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Image input found:', !!imageInput);
    console.log('Files selected:', imageInput.files.length);
    
    const imageFile = imageInput.files[0];
    
    if (imageFile) {
      console.log('Image file details:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });
    }

    if (!title || !content) {
      alert('Please enter both a title and content for your recommendation.');
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
      console.log('Starting to read image file...');
      const reader = new FileReader();
      
      reader.onload = function (e) {
        console.log('Image loaded successfully, data length:', e.target.result.length);
        postData.image = e.target.result;
        saveAndRenderRecommendationPost(postData);
        clearRecommendationInputs();
      };
      
      reader.onerror = function (err) {
        console.error("❌ Image read error:", err);
        alert("There was an error reading the image. Please try a smaller image.");
      };
      
      reader.readAsDataURL(imageFile);
    } else {
      console.log('No image file, saving post without image');
      saveAndRenderRecommendationPost(postData);
      clearRecommendationInputs();
    }
  }

  function clearRecommendationInputs() {
    console.log('Clearing inputs...');
    document.getElementById('recTitle').value = '';
    document.getElementById('recContent').value = '';
    document.getElementById('recEmail').value = '';
    document.getElementById('recImage').value = '';
  }

  function saveAndRenderRecommendationPost(post) {
    console.log('Saving post with image:', !!post.image);
    const savedPosts = JSON.parse(localStorage.getItem('recommendationPosts')) || [];
    savedPosts.unshift(post);
    localStorage.setItem('recommendationPosts', JSON.stringify(savedPosts));
    console.log('Post saved, total posts:', savedPosts.length);
    renderRecommendationPost(post, true);
  }

  function renderRecommendationPost(post, insertAtTop = false) {
    console.log('Rendering post:', post.title, 'Has image:', !!post.image);
    
    const postSection = document.createElement('section');
    postSection.style.borderBottom = '1px solid #ccc';
    postSection.style.padding = '10px 0';
    postSection.style.overflow = 'hidden';

    if (post.image) {
      console.log('Adding image to post');
      const img = document.createElement('img');
      img.src = post.image;
      img.alt = "User uploaded recommendation image";
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
    deleteBtn.textContent = 'Delete Recommendation';
    deleteBtn.style.marginTop = '10px';
    deleteBtn.style.padding = '5px 10px';
    deleteBtn.onclick = function () {
      postSection.remove();
      deleteRecommendationPost(post);
    };

    postSection.appendChild(postTitle);
    postSection.appendChild(postText);
    postSection.appendChild(postTime);
    postSection.appendChild(deleteBtn);

    const container = document.getElementById('recommendationPostsContainer');
    if (insertAtTop) {
      container.insertBefore(postSection, container.firstChild);
    } else {
      container.appendChild(postSection);
    }
  }

  function deleteRecommendationPost(targetPost) {
    let savedPosts = JSON.parse(localStorage.getItem('recommendationPosts')) || [];
    savedPosts = savedPosts.filter(post =>
      !(post.title === targetPost.title &&
        post.content === targetPost.content &&
        post.timestamp === targetPost.timestamp)
    );
    localStorage.setItem('recommendationPosts', JSON.stringify(savedPosts));
  }
