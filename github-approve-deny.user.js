// ==UserScript==
// @name GitHub Approve/Deny
// @namespace http://github.com/cisox/github-approve-deny
// @description Adds Approve and Deny buttons to GitHub pull requests and parses pull request comments for Approve/Deny text.
// @match https://github.com/*/*/pull/*
// @match http://github.com/*/*/pull/*
// @match https://www.github.com/*/*/pull/*
// @match http://www.github.com/*/*/pull/*
// @version 1.1
// @icon https://raw.github.com/cisox/github-approve-deny/master/github.png
// @downloadURL https://raw.github.com/cisox/github-approve-deny/master/github-approve-deny.user.js
// @updateURL https://raw.github.com/cisox/github-approve-deny/master/github-approve-deny.user.js
// ==/UserScript==

var approve_reply = '+1';
var deny_reply = '-1';
    
var approve_button_label = 'Approve';
var deny_button_label = 'Deny';
    
var approve_text_node_label = 'Approved';
var deny_text_node_label = 'Denied';
    
var approve_button_node_label = 'Approve';
var deny_button_node_label = 'Deny';

(function() {
    var comments = document.getElementsByClassName('js-comment-body');
        
    // format comments
    for (var idx = 0; idx < comments.length; idx++) {
        
        if (!comments[idx].children || comments[idx].children.length == 0) {
            continue;
        }

        var paragraph = comments[idx].children[0];
        if (!paragraph) {
            continue;
        }

        var commentLabel = '';
        var className = '';
        var textNodeLabel = '';
        if (paragraph.innerHTML.indexOf(approve_reply) != -1) {
            commentLabel = approve_reply;
            className = 'state state-open js-comment-approved';
            textNodeLabel = approve_text_node_label;
        } else if (paragraph.innerHTML.indexOf(deny_reply) != -1) {
            commentLabel = deny_reply;
            className = 'state state-closed js-comment-denied';
            textNodeLabel = deny_text_node_label;
        }

        if (commentLabel != '') {
            paragraph.innerHTML = paragraph.innerHTML.replace(commentLabel, '');

            var commentDiv = document.createElement('div');
            commentDiv.className = className;
            commentDiv.style.width = '100%';
            commentDiv.appendChild(document.createTextNode(textNodeLabel));

            if (paragraph.firstChild) {
                paragraph.insertBefore(commentDiv, paragraph.firstChild);
            } else {
                paragraph.appendChild(commentDiv);
            }
        }

    }

    var newCommentForm = document.getElementsByClassName('js-new-comment-form');
    if (!newCommentForm || newCommentForm.length == 0) {
        return;
    }

    newCommentForm = newCommentForm[0];

    // bind approve button action with comment
    var commentBody = newCommentForm.getElementsByClassName('js-comment-field');
    if (!commentBody || commentBody.length == 0) {
        return;
    }

    commentBody = commentBody[0];

    var createButton = function(className, width, padding, tabIndex, reply_label) {
        var button = document.createElement('button');
        button.className = className;
        button.style.width = width;
        button.style.padding = padding;
        button.tabIndex = tabIndex;
        button.onclick = function(e) {
            commentBody.value = reply_label + ' ' + commentBody.value;
            newCommentForm.submit();

            return false;
        };

        return button;
    }

    // create approve button
    var approveButton = createButton('button primary js-approve-button',
                                     '86px',
                                     '7px',
                                     5,
                                     approve_reply);

    approveButton.appendChild(document.createTextNode(approve_button_node_label));

    // create deny button
    var denyButton = createButton('button danger js-deny-button',
                                  '61px',
                                  '7px',
                                  4,
                                  deny_reply);

    denyButton.appendChild(document.createTextNode(deny_button_node_label));

    // rerange close button position 
    var formActions = newCommentForm.getElementsByClassName('form-actions');
    if (!formActions || formActions.length == 0) {
        return;
    }

    formActions = formActions[0];

    var closeButton = formActions.children[1];

    formActions.insertBefore(denyButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
    formActions.insertBefore(approveButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
})();
