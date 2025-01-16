class UserBlocker {
    constructor() {
        this.form = document.getElementById('blockForm');
        this.input = document.getElementById('newUser');
        this.userList = document.getElementById('userList');
        this.initializeEventListeners();
        this.loadBlockedUsers();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddUser();
        });
    }

    async loadBlockedUsers() {
        try {
            const { blocked_users = [] } = await chrome.storage.local.get(['blocked_users']);
            this.renderUserList(blocked_users);
        } catch (error) {
            console.error('Error loading blocked users:', error);
        }
    }

    renderUserList(users) {
        if (users.length === 0) {
            this.userList.innerHTML = '<p class="empty-message">No blocked users yet</p>';
            return;
        }

        this.userList.innerHTML = users
            .map(username => this.createUserItem(username))
            .join('');

        // Add remove button listeners
        this.userList.querySelectorAll('.remove-btn')
            .forEach(btn => btn.addEventListener('click', () => 
                this.handleRemoveUser(btn.dataset.username)
            ));
    }

    createUserItem(username) {
        return `
            <div class="user-item">
                <span>${this.sanitizeUsername(username)}</span>
                <button class="remove-btn" data-username="${username}">刪除</button>
            </div>
        `;
    }

    async handleAddUser() {
        const username = this.formatUsername(this.input.value);
        
        if (!this.isValidUsername(username)) {
            this.showError('Please enter a valid username');
            return;
        }

        try {
            await this.addBlockedUser(username);
            this.input.value = '';
        } catch (error) {
            console.error('Error adding user:', error);
            this.showError('Failed to add user');
        }
    }

    async handleRemoveUser(username) {
        try {
            await this.removeBlockedUser(username);
        } catch (error) {
            console.error('Error removing user:', error);
            this.showError('Failed to remove user');
        }
    }

    formatUsername(username) {
        return '@' + username.trim().replace('@', '');
    }

    sanitizeUsername(username) {
        return username.replace(/[<>&"']/g, '');
    }

    isValidUsername(username) {
        return username.length > 1 && username.startsWith('@');
    }

    showError(message) {
        // Implement error display logic here
        console.error(message);
    }

    async addBlockedUser(username) {
        const { blocked_users = [] } = await chrome.storage.local.get(['blocked_users']);
        if (!blocked_users.includes(username)) {
            blocked_users.push(username);
            await chrome.storage.local.set({ blocked_users });
            await this.loadBlockedUsers();
        }
    }

    async removeBlockedUser(username) {
        const { blocked_users = [] } = await chrome.storage.local.get(['blocked_users']);
        const updatedUsers = blocked_users.filter(user => user !== username);
        await chrome.storage.local.set({ blocked_users: updatedUsers });
        await this.loadBlockedUsers();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UserBlocker();
});