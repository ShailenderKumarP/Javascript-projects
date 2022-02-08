document.addEventListener('DOMContentLoaded', () => {

  const comments = JSON.parse(window.localStorage.getItem('comments')) || [];
  renderComments();

  window.addEventListener('beforeunload',() => {
    window.localStorage.setItem('comments', JSON.stringify(comments));
    console.log('unload');
  })

  document.getElementById('add-comment').addEventListener('click', () => {
    const handler = document.getElementById('handle').value;
    const msg = document.getElementById('comment').value;
    addComment(handler, msg)
  });

  document.getElementById('commentsList').addEventListener('click', (e) => {
    const target = e.target;
    const targetId = target.id;

    const [btnName,id] = targetId.split('-');
    if(btnName === 'reply') {
      const form = nestedCommentForm(id);
      document.getElementById('comment-' + id).innerHTML += form;
    } else if(btnName === 'post'){
      const handler = document.getElementById('handle-' + id).value;
      const msg = document.getElementById('msg-' + id).value;
      document.getElementById('form-'+id).parentNode.removeChild(document.getElementById('form-'+id));
      addComment(handler, msg, id);
    } else if(btnName === 'like' || btnName === 'dislike') {
      comments[id][btnName] +=1;
      renderComments();
    } else if(btnName === "delete") {
      let deleteComments = comments[id]
      delete comments[id];
      if(deleteComments.childIds.length > 0){
        deleteComments.childIds.forEach(id => delete comments[id]);
      }
      let parentIndex = comments[deleteComments.parentId].childIds.indexOf(id);
      comments[deleteComments.parentId].childIds.splice(parentIndex,1);
      console.log(comments,'after deleting');
      renderComments();
    }
  })

  function nestedCommentForm(id) {
    return `<div id="form-${id}" class="commentForm">
      <div><input type="text" id="handle-${id}" placeholder="handle"/></div>
      <div><input id="msg-${id}" placeholder="Comment"></textarea></div>
      <button id='post-${id}'>Post</button>
      </div>
      `
  }

  function addComment(handler, msg, parentId = null) {
    let newComment = {
      handler,
      msg,
      parentId,
      time: new Date(),
      childIds: [],
      id: comments.length,
      like: 0,
      dislike: 0,
    }
    comments.push(newComment);
    if(parentId) {
      comments[parentId].childIds.push(comments.length - 1);
    }
    renderComments();
  }
  function renderComments(){
    let commentsHtml = '';
    comments.forEach( comment => {
      if (!comment.parentId){
        commentsHtml += nestedCommentsTemplate(comment);
        commentsHtml += '<hr />';
      }
    });
    document.getElementById('commentsList').innerHTML = commentsHtml;
    console.log(comments, 'all comments');
  }

  function nestedCommentsTemplate(comment) {
    let commentHtml = `
      <li class="comment" id="comment-${comment.id}">
        <div class="content"><span class="handlerText">${comment.handler}</span><span>${comment.msg}</span></div>
        <span class="like" id="like-${comment.id}">&#128077; ${comment.like === 0 ? '' : comment.like }</span>
        <span class="dislike" id="dislike-${comment.id}">&#x1f44e;
        ${comment.dislike === 0 ? '' : comment.dislike }</span>
        <span id="reply-${comment.id}" class="reply">Reply</span> <span id="delete-${comment.id}" class="delete">Delete</span> - <span class="timeAgo">5m ago</span>
      </li>`;
    if(comment.childIds.length > 0) {
      commentHtml += `<ul id="childComment-${comment.id}">`;
      comment.childIds.forEach( child => commentHtml += nestedCommentsTemplate(comments[child]))
      commentHtml += '</ul>'
    }
    commentHtml += '</li>';
    return commentHtml; 
  }





});