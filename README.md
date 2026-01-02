1. Clone the repository
git clone <repository-url>
cd project

2. Install dependencies
npm install

3. Start the development server
npm start

The app will run at:
http://localhost:3000

There are public keys in config.js as its only frontend project 


##**🔑 API Handling Strategy**

Unsplash API
Used for fetching images only (read-only access)
Implemented using a custom React hook
Infinite scrolling is used for better performance
No Unsplash data is stored permanently

InstantDB
Used for real-time reactions and comments
No custom backend or server required
Each user can have only one reaction per image
Image metadata is stored with reactions and comments

##**🗄️ InstantDB Schema & Usage**

Reactions
Each reaction stores:
imageId
emoji
userId
userName
timestamp
imageMetadata

Comments
Each comment stores:
imageId
text
userId
userName
timestamp
imageMetadata
InstantDB handles real-time syncing automatically.

##**⚛️ Key React Decisions**

Functional components only
Custom hooks for API logic
Lightweight global store for shared state
Minimal animations to avoid over-engineering
UI intentionally kept simple and hand-crafted
No heavy state management libraries were used.


##**🧩 Challenges Faced & Solutions**

Environment variables
Faced issues with .env loading in a frontend-only setup
Since the APIs use public read-only keys, configuration was handled using a simple config file
In production, these would be handled via environment variables or a backend proxy
Tailwind CSS version conflicts
Encountered breaking changes in Tailwind v4
Resolved by aligning PostCSS configuration and versions
Real-time data consistency
Ensured only one reaction per user per image
Handled reaction toggling and cleanup properly

##**🔮 What I Would Improve With More Time**

Better accessibility (keyboard navigation, ARIA labels)
Improved mobile layout
Image bookmarking or favorites
Filtering and sorting in activity feed
Basic test coverage for core logic
Backend proxy for better API key handling