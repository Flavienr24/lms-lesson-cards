document.addEventListener('DOMContentLoaded', function() {
    const openMode = document.body.dataset.openMode || 'click';
    let isHoverMode = openMode === 'hover';
    // Initialize mode toggle control
    const toggle = document.getElementById('open-mode-toggle');
    const label  = document.getElementById('open-mode-label');
    if (toggle && label) {
      toggle.checked = isHoverMode;
      label.textContent = isHoverMode ? 'Hover mode' : 'Click mode';
      toggle.addEventListener('change', () => {
        isHoverMode = toggle.checked;
        document.body.dataset.openMode = isHoverMode ? 'hover' : 'click';
        label.textContent = isHoverMode ? 'Hover mode' : 'Click mode';
        // Clear inline styles and reset dropdowns when switching modes
        lessonCards.forEach(card => {
          const topicsContainer = card.querySelector('.topics-container');
          const dropdownIcon = card.querySelector('.dropdown-icon');
          if (topicsContainer) {
            topicsContainer.style.display = '';
          }
          if (dropdownIcon) {
            dropdownIcon.classList.remove('active');
          }
        });
        // Ensure only the card containing the default ready element is open
        lessonCards.forEach(card => {
          if (card.classList.contains('lesson-with-topics')) {
            const topicsContainer = card.querySelector('.topics-container');
            const dropdownIcon = card.querySelector('.dropdown-icon');
            const containsReady = defaultReadyElement && card.contains(defaultReadyElement);

            if (containsReady) {
              if (topicsContainer) topicsContainer.style.display = 'block';
              if (dropdownIcon) dropdownIcon.classList.add('active');
              if (!card.getAttribute('data-state').includes('open')) {
                card.setAttribute('data-state', card.getAttribute('data-state') + '-open');
              }
            } else {
              if (topicsContainer) topicsContainer.style.display = 'none';
              if (dropdownIcon) dropdownIcon.classList.remove('active');
              card.setAttribute('data-state', card.getAttribute('data-state').replace('-open', ''));
            }
          }
        });
      });
    }
    // Get all lesson cards
    const lessonCards = document.querySelectorAll('.lesson-card');
    
    // Get all topic items
    const topicItems = document.querySelectorAll('.topic-item');
    
    // Store a reference to which element should be in ready-to-play state
    let defaultReadyElement = null;
    
    // Function to restore the default ready-to-play element
    function restoreDefaultReadyElement() {
        if (defaultReadyElement) {
            if (defaultReadyElement.classList.contains('topic-item')) {
                // It's a topic
                defaultReadyElement.setAttribute('data-state', 'ready-to-play');
                
                // Ensure it has a play icon
                if (!defaultReadyElement.querySelector('.topic-icon.play-circle')) {
                    const topicNumber = defaultReadyElement.querySelector('.topic-number');
                    if (topicNumber) {
                        const playIcon = document.createElement('div');
                        playIcon.className = 'topic-icon play-circle';
                        const triangle = document.createElement('div');
                        triangle.className = 'play-triangle';
                        playIcon.appendChild(triangle);
                        defaultReadyElement.replaceChild(playIcon, topicNumber);
                    }
                }
            } else if (defaultReadyElement.classList.contains('lesson-card')) {
                // It's a lesson
                defaultReadyElement.setAttribute('data-state', 'ready-to-play');
                
                // Ensure it has a play icon
                const titleContainer = defaultReadyElement.querySelector('.lesson-title-container');
                if (titleContainer && !titleContainer.querySelector('.lesson-icon.play-circle')) {
                    const playIcon = document.createElement('div');
                    playIcon.className = 'lesson-icon play-circle';
                    const triangle = document.createElement('div');
                    triangle.className = 'play-triangle';
                    playIcon.appendChild(triangle);
                    titleContainer.insertBefore(playIcon, titleContainer.firstChild);
                }
            }
        }
    }
    
    // Function to reset "ready-to-play" state for lessons without topics
    function resetNoTopicsReadyState() {
        const readyLesson = document.querySelector('.lesson-card.lesson-no-topics[data-state="ready-to-play"]');
        if (readyLesson) {
            readyLesson.setAttribute('data-state', 'default');
            
            // Remove play icon if it exists
            const playIcon = readyLesson.querySelector('.lesson-icon.play-circle');
            if (playIcon) {
                playIcon.remove();
            }
        }
    }
    
    // Refactored: Function to reset "ready-to-play" state for topics
    function resetTopicsReadyState() {
        const readyTopic = document.querySelector('.topic-item[data-state="ready-to-play"]');
        if (!readyTopic) return;

        const isHoveringAnotherTopic = Array.from(document.querySelectorAll('.topic-item:hover')).some(el => el !== readyTopic);
        const isHoveringLessonNoTopics = document.querySelector('.lesson-card.lesson-no-topics:hover');

        if (isHoveringAnotherTopic || isHoveringLessonNoTopics) {
            readyTopic.setAttribute('data-state', 'default');
            const playIcon = readyTopic.querySelector('.topic-icon.play-circle');
            if (playIcon) {
                const index = Array.from(readyTopic.parentNode.children).indexOf(readyTopic);
                const topicNumber = document.createElement('div');
                topicNumber.className = 'topic-number';
                topicNumber.textContent = index + 1;
                readyTopic.replaceChild(topicNumber, playIcon);
            }
        }
    }
    
    // Function to close all lessons except the one being opened
    function closeAllExcept(exceptLessonCard) {
        lessonCards.forEach(card => {
            // Skip the card that should remain open
            if (card === exceptLessonCard) return;
            
            // Check if the card has topics
            if (card.classList.contains('lesson-with-topics')) {
                const topicsContainer = card.querySelector('.topics-container');
                if (topicsContainer) {
                    // If it has a dropdown icon, make it inactive
                    const dropdownIcon = card.querySelector('.dropdown-icon');
                    if (dropdownIcon) {
                        dropdownIcon.classList.remove('active');
                    }
                    
                    // Hide the topics container
                    topicsContainer.style.display = 'none';
                    
                    // Update state
                    if (card.getAttribute('data-state').includes('open')) {
                        card.setAttribute('data-state', card.getAttribute('data-state').replace('-open', ''));
                    }
                }
            }
        });
    }
    
    // Global mouseout function to restore ready-to-play state when nothing is hovered
    document.addEventListener('mouseout', function(e) {
        // Check if mouse has left all relevant elements
        if (!e.relatedTarget || !e.relatedTarget.closest('.lesson-card, .topic-item')) {
            // Restore the default ready element (the topic)
            restoreDefaultReadyElement();

            // Also reopen the second card if it contains the default ready element
            if (isHoverMode) {
                if (defaultReadyElement && defaultReadyElement.classList.contains('topic-item')) {
                    const parentCard = defaultReadyElement.closest('.lesson-card');
                    if (parentCard) {
                        const isCurrentlyOpen = parentCard.getAttribute('data-state').includes('open');
                        if (!isCurrentlyOpen) {
                            // Reopen the card
                            const topicsContainer = parentCard.querySelector('.topics-container');
                            if (topicsContainer) {
                                topicsContainer.style.display = 'block';
                            }
                            const dropdownIcon = parentCard.querySelector('.dropdown-icon');
                            if (dropdownIcon) {
                                dropdownIcon.classList.add('active');
                            }
                            const currentState = parentCard.getAttribute('data-state');
                            parentCard.setAttribute('data-state', currentState + '-open');
                        }
                    }
                }
            }
        }
    });

    // Add hover effects for lessons
    lessonCards.forEach(card => {
        if (card.classList.contains('lesson-no-topics')) {
            card.addEventListener('mouseenter', function() {
                // Don't change the state of validated lessons
                if (this.getAttribute('data-state') === 'validated') return;

                // Reset ready-to-play state for no-topics lessons only
                resetNoTopicsReadyState();
                // Reset ready-to-play state for topics as well
                resetTopicsReadyState();

                // Add play icon and ready state for this lesson
                if (!this.querySelector('.lesson-icon.play-circle')) {
                    const titleContainer = this.querySelector('.lesson-title-container');
                    const playIcon = document.createElement('div');
                    playIcon.className = 'lesson-icon play-circle';
                    const triangle = document.createElement('div');
                    triangle.className = 'play-triangle';
                    playIcon.appendChild(triangle);
                    titleContainer.insertBefore(playIcon, titleContainer.firstChild);
                }

                this.setAttribute('data-state', 'ready-to-play');
            });
            
            // Add mouseleave handler for lessons without topics
            card.addEventListener('mouseleave', function() {
                // Reset to default state when mouse leaves
                if (this.getAttribute('data-state') !== 'validated' && 
                    this.getAttribute('data-state') !== 'validated-open') {
                    this.setAttribute('data-state', 'default');
                    
                    // Remove play icon if exists
                    const playIcon = this.querySelector('.lesson-icon.play-circle');
                    if (playIcon) {
                        playIcon.remove();
                    }
                }
            });
            
            card.addEventListener('click', function() {
                // Handle click for lessons without topics
                // You can add functionality here
            });
        } else if (card.classList.contains('lesson-with-topics')) {
            // Add hover behavior for lessons with topics
            card.addEventListener('mouseenter', function() {
                if (!isHoverMode) return;
                // Reset currently displayed ready elements
                resetNoTopicsReadyState();
                resetTopicsReadyState();
                
                // Close all other cards
                closeAllExcept(this);
                
                // Open this card
                const topicsContainer = this.querySelector('.topics-container');
                const dropdownIcon = this.querySelector('.dropdown-icon');
                const checkIcon = this.querySelector('.lesson-check');
                
                if (topicsContainer) {
                    topicsContainer.style.display = 'block';
                    
                    // For validated lessons, swap check icon with dropdown
                    if (this.getAttribute('data-state') === 'validated' || 
                        this.getAttribute('data-state') === 'validated-open') {
                        if (checkIcon) checkIcon.style.display = 'none';
                        if (dropdownIcon) {
                            dropdownIcon.style.display = 'flex';
                            dropdownIcon.classList.add('active');
                        }
                    } else if (dropdownIcon) {
                        dropdownIcon.classList.add('active');
                    }
                    
                    // Update state to include open
                    const currentState = this.getAttribute('data-state');
                    if (!currentState.includes('open')) {
                        this.setAttribute('data-state', currentState + '-open');
                    }
                }
            });

            // Add mouseleave handler for lessons with topics (to close topics container)
            card.addEventListener('mouseleave', function() {
                if (!isHoverMode) return;
                if (defaultReadyElement && this.contains(defaultReadyElement)) {
                  return; // Do not close if this card contains the ready-to-play element
                }
                // Close topics container
                const topicsContainer = this.querySelector('.topics-container');
                if (topicsContainer) topicsContainer.style.display = 'none';
                const dropdownIcon = this.querySelector('.dropdown-icon');
                if (dropdownIcon) dropdownIcon.classList.remove('active');
                // Remove "-open" from data-state
                this.setAttribute('data-state', this.getAttribute('data-state').replace('-open', ''));
            });
            
            // Add mouseleave for validated lessons to restore check icon
            if (card.getAttribute('data-state') === 'validated' || 
                card.getAttribute('data-state') === 'validated-open') {
                card.addEventListener('mouseleave', function() {
                    if (!isHoverMode) return;
                    const dropdownIcon = this.querySelector('.dropdown-icon');
                    const checkIcon = this.querySelector('.lesson-check');
                    
                    // Restore check icon and hide dropdown
                    if (checkIcon) checkIcon.style.display = 'flex';
                    if (dropdownIcon) dropdownIcon.style.display = 'none';
                    
                    // Close topics container
                    const topicsContainer = this.querySelector('.topics-container');
                    if (topicsContainer) {
                        topicsContainer.style.display = 'none';
                    }
                    
                    // Update state
                    this.setAttribute('data-state', 'validated');
                });
            }
        }
    });
    
    // Add hover effects for topics
    topicItems.forEach(topic => {
        topic.addEventListener('mouseenter', function() {
            // Reset ready-to-play states for display only
            resetTopicsReadyState();
            
            // Add play icon for this topic
            topic.querySelector('.play-icon-hover').style.display = 'flex';
            topic.classList.add('hovered');
            
            // Hide check icon if this is a validated topic
            const checkIcon = topic.querySelector('.topic-icon.check');
            if (checkIcon) {
                checkIcon.style.display = 'none';
            }
        });
        
        topic.addEventListener('mouseleave', function() {
            // Hide play icon
            topic.querySelector('.play-icon-hover').style.display = 'none';
            topic.classList.remove('hovered');
            
            // Restore check icon if this is a validated topic
            if (topic.getAttribute('data-state') === 'validated') {
                const checkIcon = topic.querySelector('.topic-icon.check');
                if (checkIcon) {
                    checkIcon.style.display = 'flex';
                }
            }
        });
        
        topic.addEventListener('click', function() {
            // Reset previous ready-to-play state
            resetTopicsReadyState();
            
            // Set this topic to ready-to-play
            topic.setAttribute('data-state', 'ready-to-play');
            
            // Store this as the default ready element
            defaultReadyElement = topic;
            
            // Replace number with play icon
            const topicNumber = topic.querySelector('.topic-number');
            if (topicNumber) {
                const playIcon = document.createElement('div');
                playIcon.className = 'topic-icon play-circle';
                const triangle = document.createElement('div');
                triangle.className = 'play-triangle';
                playIcon.appendChild(triangle);
                topic.replaceChild(playIcon, topicNumber);
            }
        });
    });
    
    // Add click event to lesson headers for lessons with topics
    const lessonsWithTopics = document.querySelectorAll('.lesson-card.lesson-with-topics');
    lessonsWithTopics.forEach(card => {
        const header = card.querySelector('.lesson-header');
        const dropdownIcon = card.querySelector('.dropdown-icon');
        const topicsContainer = card.querySelector('.topics-container');
        
        if (header) {
          header.addEventListener('click', function() {
            if (isHoverMode) return;
            // Close all other lessons first
            closeAllExcept(card);
            
            // Toggle dropdown icon rotation
            if (dropdownIcon) {
                dropdownIcon.classList.toggle('active');
            }
            
            // Toggle visibility of topics container
            if (topicsContainer.style.display === 'none') {
                topicsContainer.style.display = 'block';
                card.setAttribute('data-state', card.getAttribute('data-state') + '-open');
            } else {
                topicsContainer.style.display = 'none';
                card.setAttribute('data-state', card.getAttribute('data-state').replace('-open', ''));
            }
          });
        }
    });
    
    // Set initial state for lessons - respecting HTML default states
    window.addEventListener('load', function() {
        // Ensure first card (validated) is closed
        const firstCard = document.querySelector('.lesson-card.lesson-with-topics[data-state="validated"]');
        if (firstCard) {
            const topicsContainer = firstCard.querySelector('.topics-container');
            if (topicsContainer) {
                topicsContainer.style.display = 'none';
            }
        }

        // Ensure second card is open with first topic ready-to-play
        const secondCard = document.querySelector('.lesson-card.lesson-with-topics[data-state="default-open"]');
        if (secondCard) {
            const topicsContainer = secondCard.querySelector('.topics-container');
            if (topicsContainer) {
                topicsContainer.style.display = 'block';
            }

            // Ensure first topic is in ready-to-play state
            const firstTopic = secondCard.querySelector('.topic-item:first-child');
            if (firstTopic) {
                firstTopic.setAttribute('data-state', 'ready-to-play');

                // Set this as the default ready element
                defaultReadyElement = firstTopic;
            }
        }

        // Close all other lesson-with-topics cards
        const lessonCards = document.querySelectorAll('.lesson-card');
        const openCard = secondCard;
        lessonCards.forEach(card => {
            if (card.classList.contains('lesson-with-topics') && card !== openCard) {
                const topicsContainer = card.querySelector('.topics-container');
                const dropdownIcon = card.querySelector('.dropdown-icon');
                if (topicsContainer) topicsContainer.style.display = 'none';
                if (dropdownIcon) dropdownIcon.classList.remove('active');
                card.setAttribute('data-state', card.getAttribute('data-state').replace('-open', ''));
            }
        });
    });
});
