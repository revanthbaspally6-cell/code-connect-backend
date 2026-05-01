const mongoose = require('mongoose');
const User = require('./models/User');
const Snippet = require('./models/Snippet');
require('dotenv').config();

async function createFakeData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing snippets
    await Snippet.deleteMany({});
    console.log('Cleared existing snippets');

    // Get existing users or create demo users
    let users = await User.find({});
    
    if (users.length === 0) {
      // Create demo users
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      const demoUsers = await User.create([
        {
          username: 'john_developer',
          email: 'john@example.com',
          password: hashedPassword,
          bio: 'Full-stack developer passionate about clean code'
        },
        {
          username: 'sarah_coder',
          email: 'sarah@example.com',
          password: hashedPassword,
          bio: 'Frontend specialist and UI/UX enthusiast'
        },
        {
          username: 'mike_programmer',
          email: 'mike@example.com',
          password: hashedPassword,
          bio: 'Backend engineer and system architect'
        }
      ]);
      users = demoUsers;
      console.log('Created demo users');
    }

    // Create fake snippets directly using MongoDB insertMany (bypasses Mongoose hooks)
    const fakeSnippets = [
      {
        title: 'React Custom Hook for API Calls',
        description: 'A reusable hook for handling API requests with loading states',
        code: `import { useState, useEffect } from 'react';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

// Usage example
const MyComponent = () => {
  const { data, loading, error } = useApi('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
};`,
        language: 'javascript',
        tags: ['react', 'hooks', 'api', 'frontend'],
        author: users[0]._id,
        isPublic: true,
        likes: [],
        comments: [],
        views: 245,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Python Data Processing Pipeline',
        description: 'Efficient data processing using pandas and numpy',
        code: `import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class DataProcessor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.data = None
        self.processed_data = None
    
    def load_data(self):
        """Load and clean the dataset"""
        self.data = pd.read_csv(self.file_path)
        
        # Remove duplicates and handle missing values
        self.data = self.data.drop_duplicates()
        self.data = self.data.fillna(self.data.mean())
        
        print(f"Loaded {len(self.data)} records")
        return self.data
    
    def process_data(self):
        """Apply transformations and calculations"""
        if self.data is None:
            self.load_data()
        
        # Calculate rolling averages
        self.data['rolling_avg'] = self.data['value'].rolling(window=7).mean()
        
        # Add trend analysis
        self.data['trend'] = np.where(
            self.data['value'] > self.data['rolling_avg'], 
            'upward', 
            'downward'
        )
        
        self.processed_data = self.data
        return self.processed_data
    
    def export_results(self, output_path):
        """Export processed data"""
        if self.processed_data is not None:
            self.processed_data.to_csv(output_path, index=False)
            print(f"Results exported to {output_path}")

# Usage
processor = DataProcessor('sales_data.csv')
processed = processor.process_data()
processor.export_results('processed_sales.csv')`,
        language: 'python',
        tags: ['python', 'pandas', 'data', 'analysis'],
        author: users[1]._id,
        isPublic: true,
        likes: [],
        comments: [],
        views: 189,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Modern CSS Grid Layout System',
        description: 'Responsive grid layout with CSS Grid and Flexbox',
        code: `/* Modern CSS Grid Layout System */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .card {
    margin-bottom: 1rem;
  }
}`,
        language: 'css',
        tags: ['css', 'grid', 'responsive', 'layout'],
        author: users[2]._id,
        isPublic: true,
        likes: [],
        comments: [],
        views: 156,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Node.js Express REST API',
        description: 'Complete REST API with authentication and error handling',
        code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
        language: 'javascript',
        tags: ['nodejs', 'express', 'api', 'backend'],
        author: users[0]._id,
        isPublic: true,
        likes: [],
        comments: [],
        views: 312,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'TypeScript Generic Utility Classes',
        description: 'Reusable TypeScript utilities with strong typing',
        code: `// Generic API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generic Repository Pattern
abstract class Repository<T> {
  protected items: T[] = [];

  abstract findById(id: string): T | undefined;
  abstract findAll(): T[];
  abstract create(item: Omit<T, 'id'>): T;
  abstract update(id: string, item: Partial<T>): T | undefined;
  abstract delete(id: string): boolean;
}

// User Repository Implementation
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

class UserRepository extends Repository<User> {
  private nextId = 1;

  findById(id: string): User | undefined {
    return this.items.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.items;
  }

  create(userData: Omit<User, 'id'>): User {
    const user: User = {
      id: this.nextId.toString(),
      ...userData,
      createdAt: new Date()
    };
    this.items.push(user);
    this.nextId++;
    return user;
  }

  update(id: string, userData: Partial<User>): User | undefined {
    const userIndex = this.items.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;

    this.items[userIndex] = { ...this.items[userIndex], ...userData };
    return this.items[userIndex];
  }

  delete(id: string): boolean {
    const userIndex = this.items.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.items.splice(userIndex, 1);
    return true;
  }
}

// Usage Example
const userRepo = new UserRepository();
const newUser = userRepo.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});

console.log(newUser);`,
        language: 'typescript',
        tags: ['typescript', 'generics', 'patterns', 'oop'],
        author: users[1]._id,
        isPublic: true,
        likes: [],
        comments: [],
        views: 278,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'C++ Smart Pointers Example',
        description: 'Modern C++ with smart pointers and RAII',
        code: `#include <iostream>
#include <memory>
#include <vector>
#include <string>

class Resource {
private:
    std::string name;
    int* data;

public:
    Resource(const std::string& n, int size) : name(n) {
        data = new int[size];
        for (int i = 0; i < size; ++i) {
            data[i] = i * 10;
        }
        std::cout << "Resource " << name << " created\\n";
    }

    ~Resource() {
        delete[] data;
        std::cout << "Resource " << name << " destroyed\\n";
    }

    void display() const {
        std::cout << name << " data: ";
        for (int i = 0; i < 5; ++i) {
            std::cout << data[i] << " ";
        }
        std::cout << "\\n";
    }
};

void demonstrateSmartPointers() {
    // Unique pointer - exclusive ownership
    std::unique_ptr<Resource> ptr1 = 
        std::make_unique<Resource>("Unique", 10);
    ptr1->display();

    // Shared pointer - shared ownership
    std::shared_ptr<Resource> ptr2 = 
        std::make_shared<Resource>("Shared", 15);
    
    {
        std::shared_ptr<Resource> ptr3 = ptr2; // shares ownership
        std::cout << "Shared count: " << ptr2.use_count() << "\\n";
        ptr3->display();
    }
    
    std::cout << "Shared count after scope: " << ptr2.use_count() << "\\n";

    // Weak pointer - non-owning reference
    std::weak_ptr<Resource> weakPtr = ptr2;
    if (auto sharedPtr = weakPtr.lock()) {
        std::cout << "Weak pointer successfully locked\\n";
        sharedPtr->display();
    }
}

int main() {
    demonstrateSmartPointers();
    return 0;
}`,
        language: 'cpp',
        tags: ['cpp', 'smart-pointers', 'memory-management', 'modern-cpp'],
        author: users[2]._id,
        isPublic: true,
        likes: [],
        comments: [],
        views: 145,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ];

    // Insert snippets directly to bypass Mongoose hooks
    const collection = mongoose.connection.db.collection('snippets');
    const result = await collection.insertMany(fakeSnippets);
    
    console.log(`Created ${result.insertedCount} fake snippets`);
    console.log('Fake data created successfully!');
    
    // Add some likes and comments to make it look realistic
    const snippets = await Snippet.find({});
    for (let i = 0; i < snippets.length; i++) {
      const snippet = snippets[i];
      
      // Add random likes
      const numLikes = Math.floor(Math.random() * 20) + 5;
      snippet.likes = users.slice(0, numLikes).map(u => u._id);
      
      // Add random comments
      const numComments = Math.floor(Math.random() * 8) + 2;
      snippet.comments = users.slice(0, numComments).map(u => u._id);
      
      await snippet.save();
    }
    
    console.log('Added likes and comments to snippets');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating fake data:', error);
    process.exit(1);
  }
}

createFakeData();
