# Jukeboxx - Spotify Clone

Jukeboxx is a Spotify-inspired music player application built as a side project to enhance JavaScript skills. While the design may not be perfect due to my early experience with frontend development, the functionality of the project is robust and works seamlessly. The application uses a local directory of songs and albums, allowing users to play, pause, and interact with music files.

## Features

- **Music Playback**: Play and pause songs from a local directory.
- **Album Support**: Organize and browse music by albums.
- **Customizable Directory**: Users can add their own songs and albums to the local directory for personal use.
- **Functional Focus**: Prioritizes JavaScript functionality over design.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Local Hosting**: Runs on localhost for development and testing purposes.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jukeboxx
   ```

2. Add your songs and albums:
   - Place your audio files in the designated local directory used by the application.
   - Update the file paths in the code as needed.

3. Start a local server:
   - Use any local server tool (e.g., VS Code Live Server, Python's `http.server`, etc.) to serve the project files.

4. Update the `fetch` URL in the JavaScript:
   - Locate the fetch calls in the JavaScript code.
   - Replace the fetch URL with the URL where your website is running locally (e.g., `http://localhost:3000`).

5. Open the application in your browser:
   - Navigate to your local server's URL (e.g., `http://localhost:3000`).

## Limitations

- The design is not polished as it was created during my early learning days in frontend development.
- The application is designed to work on localhost. If you run it elsewhere, you must update the fetch URLs in the JavaScript code accordingly.
- Only two albums and couple of songs are included for testing. You are encouraged to add more for personal use.

## Usage Instructions

1. Add your audio files to the local directory.
2. Update file paths in the code if necessary.
3. Run a local server and access the application through your browser.
4. Enjoy playing music directly from your custom library!

## Future Improvements

This project was an early experiment in web development, but there are several areas for potential improvement:

- Enhance the UI/UX design for a more modern look.
- Add features like playlists, search functionality, and volume control.
- Enable support for streaming music from external APIs instead of relying on local files.
- Make it deployable online for easier access.

## Acknowledgments

This project was built as a learning exercise to improve JavaScript skills while exploring basic web development concepts. Thank you for checking out Jukeboxx! Feel free to customize it for your personal use or build upon it for further enhancements.

---

Enjoy listening! Feedback and suggestions are always welcome!
