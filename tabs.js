// Tab switching functionality
const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    
    // Remove active class from all tabs and contents
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    tabs.forEach(t => {
      t.classList.remove('active');
    });
    
    // Add active class to clicked tab and its content
    tab.classList.add('active');
    target.classList.add('active');
  });
});
