function changeTheColorOfButton() {
  var inputField = document.getElementById("username");
  var submitButton = document.getElementById("card_submit_button");

  if (inputField.value === "") {
    submitButton.style.background = "rgba(255, 255, 255, 0.25)";
    submitButton.style.pointerEvents = "none";
  } else {
    submitButton.style.background = "#01b49f";
    submitButton.style.cursor = "pointer"
    submitButton.style.pointerEvents = "auto";
  }
}

function editComment(button) {

  const editBox = document.querySelector('.edit-box');
  if (editBox) {
    alert("Edit box already opened")
    return;
  }

  const card = button.closest('.comment__card');
  const comment = card.querySelector('p');

  const newComment = document.createElement('div');
  newComment.classList.add('edit-box');
  newComment.innerHTML = `
  <div class="comment__card">
    <div class="main">
      <div class="profile-pic">
        <img src="./static/profilepic.png"  alt="User profile photo">
      </div>
                
      <div class="username_textbox">
        <input type="text" id="comment_tb2" name="comment_tb" class="input-field" required autocomplete="off">
        <div class="underline"></div>
        <label class="input-label">Reply</label>
      </div>
    </div>
            
    <button id="main_page_cancel_button" type="button">Cancel</button>
    <button id="main_page_comment_button" type="button">Submit</button>
  </div>`;

  const input = newComment.querySelector('#comment_tb2');
  input.value = comment.textContent;

  comment.parentNode.replaceChild(newComment, comment)

  const submitButton = newComment.querySelector('#main_page_comment_button');
  const cancelButton = newComment.querySelector('#main_page_cancel_button');

  submitButton.addEventListener('click', function () {
    const updatedText = input.value;

    if (updatedText === "") {
      alert("This field cannot be Empty");
      return false;
    }
    const updatedComment = document.createElement('p');
    updatedComment.textContent = updatedText;
    newComment.parentNode.replaceChild(updatedComment, newComment);
  });

  cancelButton.addEventListener('click', function () {
    const updatedText = comment.textContent;
    const updatedComment = document.createElement('p');
    updatedComment.textContent = updatedText;
    newComment.parentNode.replaceChild(updatedComment, newComment);
  });
}

function addReplyBox(replyButton) {

  const replyBox = document.querySelector('.reply-box');
  if (replyBox) {
    replyBox.remove();
    return;
  }

  const parentCommentCard = replyButton.closest('.comment__card');
  const parentCommentContainer = parentCommentCard.nextElementSibling;

  const newReplyBox = document.createElement('div');
  newReplyBox.classList.add('reply-box');
  newReplyBox.innerHTML = `
  <div class="comment__card">
    <div class="main">
      <div class="profile-pic">
        <img src="./static/profilepic.png"  alt="User profile photo">
      </div>

  
      <div class="username_textbox">
        <input type="text" id="username1" name="username" class="input-field" required autocomplete="off">
        <div class="underline"></div>
        <label class="input-label">Username</label>
      </div>
    </div>

    <div class="comment_textbox">
      <input type="text" id="comment_tb1" name="comment_tb" class="input-field" required autocomplete="off">
      <div class="underline"></div>
      <label class="input-label">Reply</label>
    </div>
            
    <button id="main_page_cancel_button" type="button">Cancel</button>
    <button id="main_page_comment_button" type="button">Submit</button>
  </div>`;

  parentCommentCard.after(newReplyBox);

  const submitButton = newReplyBox.querySelector('#main_page_comment_button');
  const cancelButton = newReplyBox.querySelector('#main_page_cancel_button');

  submitButton.addEventListener('click', function () {
    var name = document.getElementById("username1").value;
    var comment = document.getElementById("comment_tb1").value;
    unhide_all_replies(replyButton);
    const ans = submitInnerComment(name, comment, parentCommentContainer);
    if (ans === false) {
      alert("This field cannot be Empty");
      return false
    }
    newReplyBox.remove();
    updateRepliesCount();
  });

  cancelButton.addEventListener('click', function () {
    newReplyBox.remove();
  });
}


function likeComment(button) {
  const card = button.closest('.comment__card');
  const count = card.querySelector('.like-count');
  const likes = Number(count.textContent);
  count.textContent = likes + 1;

  // Get all the comment cards and their containers in the container
  const container = card.parentElement;
  const cards = Array.from(container.children);

  // If the closest card is mainchild, exclude the first child element when sorting
  if (card.id === 'mainchild') {
    var firstCard = cards.shift(); // Remove the first child element from the array
    var secondCard = cards.shift();
  }

  const pairs = [];

  for (let i = 0; i < cards.length; i += 2) {
    pairs.push([cards[i], cards[i + 1]]);
  }

  // Sort the remaining cards based on their like count
  pairs.sort((a, b) => {
    const aLikes = Number(a[0].querySelector('.like-count')?.textContent || 0);
    const bLikes = Number(b[0].querySelector('.like-count')?.textContent || 0);
    return bLikes - aLikes;
  });

  var newPairs = pairs.flat()

  // Add back the first child element at the start of the sorted array
  if (card.id === 'mainchild') {
    newPairs.unshift(secondCard);
    newPairs.unshift(firstCard);
  }

  newPairs.forEach((card, index) => {
    container.insertBefore(card, container.children[index]);
  });

}




function submitInnerComment(name, comment, parentCommentContainer) {
  if (name && comment) {
    // create the comment HTML
    var commentHTML = `
      <div class="comment__card">
        <div class="main2">
          <img src="./static/profilepic.png" alt="User Profile Pic">
          <h3 class="comment__title">${name}</h3>
        </div>
        <div class="comment__card-header">
          <button class="delete-button" onclick="deleteComment(this)">
            <img src="./static/delete.png" alt="Delete" class="delete-image">
          </button>
          <button class="edit-button" onclick="editComment(this)">
            <img src="./static/edit.png" alt="Edit" class="edit-image">
          </button>
        </div>
        <div class="comment__card-body">
          <p>${comment}</p>
        </div>
        <div class="comment__card-footer">
          <button class="like-button" onclick="likeComment(this)">
            <img src="./static/upvote.png" alt="Like" class="upvote-image">
          </button>
          <span class="like-count">0</span>
          <button class="reply-button" onclick="addReplyBox(this)">
            <img src="./static/reply.png" alt="Reply" class="reply-image">
          </button>
          <div class="show-replies" onclick="showReplies_function(this)">Replies</div>
          <span class="replies-count">0</span>
        </div>
      </div>
      <div class="comment__container hidden"></div>
    `;
    
    // add the comment HTML to the parent container
    parentCommentContainer.innerHTML += commentHTML;

    // show the parent container if it was hidden
    if (parentCommentContainer.classList.contains('hidden')) {
      parentCommentContainer.classList.remove('hidden');
    }
  } else {
    return false;
  }
}



function submitComment() {
  var name = document.getElementById("username").value;
  var comment = document.getElementById("comment_tb").value;

  if (name && comment) {
    var commentCardDiv = `
      <div class="comment__card" id="mainchild">
        <div class="main2">
          <img src="./static/profilepic.png" alt="User Profile Pic">
          <h3 class="comment__title">${name}</h3>
        </div>
        <div class="comment__card-header">
          <button class="delete-button" onclick="deleteComment(this)">
            <img src="./static/delete.png" alt="Delete" class="delete-image">
          </button>
          <button class="edit-button" onclick="editComment(this)">
            <img src="./static/edit.png" alt="Edit" class="edit-image">
          </button>
        </div>
        <div class="comment__card-body">
          <p>${comment}</p>
        </div>
        <div class="comment__card-footer">
          <button class="like-button" onclick="likeComment(this)">
            <img src="./static/upvote.png" alt="Like" class="upvote-image">
          </button>
          <span class="like-count">0</span>
          <button class="reply-button" onclick="addReplyBox(this)">
            <img src="./static/reply.png" alt="Reply" class="reply-image">
          </button>
          <div class="show-replies" onclick="showReplies_function(this)">Replies</div>
          <span class="replies-count">0</span>
        </div>
      </div>
      <div class="comment__container hidden"></div>
    `;

    document.getElementById("home_page_comment").innerHTML += commentCardDiv;
    document.getElementById("comment_tb").value = "";
  }
  else {
    console.log("in");
    alert("This Field cannot be empty");
    return false;
  }
}


function deleteComment(buttonElement) {

  if(confirm("Are you sure you want to delete this"))
  {
    const parentCommentCard = buttonElement.closest('.comment__card');
    const siblingCommentContainer = parentCommentCard.nextElementSibling;

    const parentCommentContainer = parentCommentCard.closest('.comment__container');

    parentCommentCard.remove();
    siblingCommentContainer.remove();
    
    if (parentCommentContainer && parentCommentContainer.children.length === 0){
      const newLength = parentCommentContainer.children.length;
      console.log(newLength);
      parentCommentContainer.classList.add('hidden');
    }

    updateRepliesCount();
  }
}


function updateRepliesCount() {
  const repliesCountElements = document.querySelectorAll('.replies-count');
  repliesCountElements.forEach(repliesCountElement => {
    const commentCard = repliesCountElement.closest('.comment__card');
    const siblingCommentContainer = commentCard.nextElementSibling;
    if (siblingCommentContainer) {
      const commentCards = siblingCommentContainer.querySelectorAll('.comment__card');
      const repliesCount = commentCards.length;
      const repliesCountElement = commentCard.querySelector('.replies-count');
      repliesCountElement.textContent = repliesCount;
    }
  });
}

updateRepliesCount();

function hideReplies_globally() {
  const repliesCountElements = document.querySelectorAll('.show-replies');
  repliesCountElements.forEach(repliesCountElement => {
    const commentCard = repliesCountElement.closest('.comment__card');
    const siblingCommentContainer = commentCard.nextElementSibling;
    if (siblingCommentContainer) {

      if (siblingCommentContainer.classList.contains('hidden')) {
        siblingCommentContainer.classList.remove('hidden');
      }
      else {
        siblingCommentContainer.classList.add('hidden');
      }

    }
  });
}

hideReplies_globally();

function showReplies_function(showRepliesElement) {
  const commentCard = showRepliesElement.closest('.comment__card');
  const siblingCommentContainer = commentCard.nextElementSibling;
  if (siblingCommentContainer && siblingCommentContainer.children.length > 0) {

    if (siblingCommentContainer.classList.contains('hidden')) {
      siblingCommentContainer.classList.remove('hidden');
    }
    else {
      siblingCommentContainer.classList.add('hidden');
    }

  }
}

function unhide_all_replies(showRepliesElement) {
  const commentCard = showRepliesElement.closest('.comment__card');
  if (commentCard) {
    const commentContainerElements = commentCard.querySelectorAll('.comment__container');
    commentContainerElements.forEach(commentContainerElement => {

      if (commentContainerElement.classList.contains('hidden')) {
        commentContainerElement.classList.remove('hidden');
      }

    });
  }
}


let username = "";

function validate(event) {
  event.preventDefault();

  const inputField = document.getElementById("username");
  if (inputField.value === "") {
    alert("Please enter a username");
    return false;
  }

  username = inputField.value;

  document.querySelector('.container').style.display = 'block';
  document.body.style.backgroundColor = "#222831";
  document.getElementById("username-display").innerHTML = username;

  const card = document.querySelector(".card");
  const overlay = document.querySelector(".overlay");
  card.style.display = "none";
  overlay.style.display = "none";
  return true;
}


function clearComment(commentId) {

  const commentBox = document.getElementById(commentId);
  commentBox.value = "";

}