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

(function() {
    var comments = document.getElementsByClassName('js-comment-body');

    var approve_list = []

    var approve_reply = '+1';
    var deny_reply = '-1';
    var approve_button_label = 'Approve';
    var deny_button_label = 'Deny';
    var approve_text_node_msg = 'Approved';
    var deny_text_node_msg = 'Denied';
    var approve_button_node_msg = 'Approve';
    var deny_button_node_msg = 'Deny';

    for (var idx = 0; idx < comments.length; idx++) {
        if (!comments[idx].children || comments[idx].children.length == 0) {
            continue;
        }

        var paragraph = comments[idx].children[0];
        if (!paragraph) {
            continue;
        }

        if (paragraph.innerHTML.indexOf(approve_reply) != -1) {
            paragraph.innerHTML = paragraph.innerHTML.replace(approve_reply, '');

            var approval = document.createElement('div');
            approval.className = 'state state-open js-comment-approved';
            approval.style.width = '100%';
            approval.appendChild(document.createTextNode(approve_text_node_msg));

            if (paragraph.firstChild) {
                paragraph.insertBefore(approval, paragraph.firstChild);
            } else {
                paragraph.appendChild(approval);
            }
        } else if (paragraph.innerHTML.indexOf(deny_reply) != -1) {
            paragraph.innerHTML = paragraph.innerHTML.replace(deny_reply, '');

            var denial = document.createElement('div');
            denial.className = 'state state-closed js-comment-denied';
            denial.style.width = '100%';
            denial.appendChild(document.createTextNode(deny_text_node_msg));

            if (paragraph.firstChild) {
                paragraph.insertBefore(denial, paragraph.firstChild);
            } else {
                paragraph.appendChild(denial);
            }
        }
    }

    var newCommentForm = document.getElementsByClassName('js-new-comment-form');
    if (!newCommentForm || newCommentForm.length == 0) {
        return;
    }

    newCommentForm = newCommentForm[0];

    var commentBody = newCommentForm.getElementsByClassName('js-comment-field');
    if (!commentBody || commentBody.length == 0) {
        return;
    }

    commentBody = commentBody[0];

    var formActions = newCommentForm.getElementsByClassName('form-actions');
    if (!formActions || formActions.length == 0) {
        return;
    }

    formActions = formActions[0];

    var approveButton = document.createElement('button');
    approveButton.className = 'button primary js-approve-button';
    approveButton.style.width = '86px';
    approveButton.style.padding = '7px';
    approveButton.tabIndex = 5;
    approveButton.onclick = function(e) {
        commentBody.value = approve_reply + ' ' + commentBody.value;
        newCommentForm.submit();

        return false;
    };

    approveButton.appendChild(document.createTextNode(approve_button_node_msg));

    var denyButton = document.createElement('button');
    denyButton.className = 'button danger js-deny-button';
    denyButton.style.width = '61px';
    denyButton.style.padding = '7px';
    denyButton.tabIndex = 4;
    denyButton.onclick = function(e) {
        commentBody.value = deny_reply + ' ' + commentBody.value;
        newCommentForm.submit();

        return false;
    };

    denyButton.appendChild(document.createTextNode(deny_button_node_msg));

    var closeButton = formActions.children[1];

    formActions.insertBefore(denyButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
    formActions.insertBefore(approveButton, closeButton);
    formActions.insertBefore(document.createTextNode(' '), closeButton);
})();
