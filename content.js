// Function to check if username is in blocked list
async function isBlockedUsername(username) {
    return new Promise((resolve) => {
        chrome.storage.local.get(['blocked_users'], function(result) {
            const blockedUsers = Array.isArray(result.blocked_users) ? result.blocked_users : [];
            console.log('Blocked users list:', blockedUsers);
            // Remove @ if it exists, then add it back for comparison
            username = '@' + username.replace('@', '');
            console.log('Checking username:', username);
            const isBlocked = blockedUsers.some(blockedUser => 
                ('@' + blockedUser.replace('@', '')).toLowerCase() === username.toLowerCase()
            );
            console.log('Is blocked?', isBlocked);
            resolve(isBlocked);
        });
    });
}
// Function to hide comment
function hideComment(element) {
    if (element) {
        console.log('Hiding comment container:', element);
        element.style.cssText = 'display: none !important; visibility: hidden !important;';
    }
}
// Function to extract usernames and hide blocked comments
async function findComments() {
    const alternateNames = new Map();
    const links = document.querySelectorAll('a[href^="/@"]');
    
    for (const link of links) {
        const alternateName = link.getAttribute('href').substring(2);
        const commentContainer = link.closest('[data-key^="comment-"]');
        
        if (commentContainer) {
            const isBlocked = await isBlockedUsername(alternateName);
            if (isBlocked) {
                hideComment(commentContainer);
                const commentId = commentContainer.getAttribute('data-key').replace('comment-', '');
                alternateNames.set(commentId, alternateName);
                console.log(`Blocked comment from user: "${alternateName}" with ID: ${commentId}`);
            }
        }
    }
}

// Function to click "View more comments" buttons
async function expandAllComments() {
    let foundButtons = true;
    while (foundButtons) {
        const buttons = Array.from(document.querySelectorAll('button')).filter(button => 
            button.textContent.toLowerCase().includes('view') && 
            button.textContent.toLowerCase().includes('comments')
        );
        
        if (buttons.length === 0) {
            foundButtons = false;
            break;
        }

        console.log(`Found ${buttons.length} "View more" buttons`);
        
        for (const button of buttons) {
            console.log('Clicking "View more comments" button');
            button.click();
            // Reduced from 1000ms to 500ms
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Reduced from 1500ms to 750ms
        await new Promise(resolve => setTimeout(resolve, 750));
    }
}

// Main function to check and block comments
async function checkAndBlockComments() {
    console.log('Starting comment check...');
    
    // First expand all comments
    console.log('Expanding all comments...');
    await expandAllComments();
    
    // Then process comments
    await findComments();
    console.log('Finished processing comments');
}


// Run when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAndBlockComments();
    
    // Move MutationObserver setup inside DOMContentLoaded
    const observer = new MutationObserver(mutations => {
        // Check if new comments were added
        const hasNewComments = mutations.some(mutation => 
            Array.from(mutation.addedNodes).some(node => 
                node.nodeType === 1 && node.querySelector('[data-key^="comment-"]')
            )
        );
        
        if (hasNewComments) {
            checkAndBlockComments();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});