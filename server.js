const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATABASE_FILE = 'contacts.json';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize database file if it doesn't exist
async function initDatabase() {
    try {
        await fs.access(DATABASE_FILE);
    } catch (error) {
        // File doesn't exist, create it
        await fs.writeFile(DATABASE_FILE, JSON.stringify([], null, 2));
        console.log('Database file created: contacts.json');
    }
}

// Read contacts from database
async function readContacts() {
    try {
        const data = await fs.readFile(DATABASE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts:', error);
        return [];
    }
}

// Write contacts to database
async function writeContacts(contacts) {
    try {
        await fs.writeFile(DATABASE_FILE, JSON.stringify(contacts, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing contacts:', error);
        return false;
    }
}

// API Routes

// Submit contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }
        
        // Create contact entry
        const contact = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        // Read existing contacts
        const contacts = await readContacts();
        
        // Add new contact
        contacts.unshift(contact); // Add to beginning for latest first
        
        // Write back to database
        const success = await writeContacts(contacts);
        
        if (success) {
            console.log(`New contact received from ${name} (${email})`);
            res.json({ 
                success: true, 
                message: 'Contact saved successfully',
                id: contact.id
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save contact' 
            });
        }
        
    } catch (error) {
        console.error('Error processing contact:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});

// Get all contacts (for admin view)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await readContacts();
        res.json({ 
            success: true, 
            contacts: contacts,
            total: contacts.length
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch contacts' 
        });
    }
});

// Get contact by ID
app.get('/api/contacts/:id', async (req, res) => {
    try {
        const contacts = await readContacts();
        const contact = contacts.find(c => c.id === req.params.id);
        
        if (contact) {
            res.json({ success: true, contact });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Contact not found' 
            });
        }
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});

// Delete contact by ID
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        const contacts = await readContacts();
        const filteredContacts = contacts.filter(c => c.id !== req.params.id);
        
        if (filteredContacts.length < contacts.length) {
            await writeContacts(filteredContacts);
            res.json({ 
                success: true, 
                message: 'Contact deleted successfully' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Contact not found' 
            });
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
async function startServer() {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📊 Admin dashboard: http://localhost:${PORT}/admin`);
        console.log(`📁 Database file: ${DATABASE_FILE}`);
    });
}

startServer();