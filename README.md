# Djinni Job Application Bot

An automated job application bot for Djinni.co that uses OpenAI to generate personalized cover letters and enhance CVs for each application.

## Features

- 🔐 Automated login with cookie persistence
- 🔍 Job search with customizable keywords
- ✍️ OpenAI-powered cover letter generation
- 📄 CV enhancement based on job descriptions
- 📁 PDF document handling
- 📝 Detailed logging system
- 🌐 Configurable browser automation
- 🔄 Session management with cookie support
- 📊 Application tracking and storage

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- OpenAI API key
- Djinni.co account
- Basic understanding of TypeScript/JavaScript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/djinni-bot.git
cd djinni-bot
```

2. Install dependencies:
```bash
yarn install
```

## Configuration

1. Create a `.env` file in the root directory with the following variables:
```
# OpenAI Configuration
OPENAI_SECRET_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
# Djinni Credentials
DJINNI_EMAIL=your_email@example.com
DJINNI_PASS=your_password
DJINNI_PRIMARY_KEYWORD=JavaScript
# Browser Configuration
BROWSER_HEADLESS=true
BROWSER_SLOW_MO=50
BROWSER_WIDTH=1920
BROWSER_HEIGHT=1080
BROWSER_TIMEOUT=30000
SCREENSHOTS_ENABLED=false
# Authentication
COOKIES_ENABLED=true
COOKIES_PATH=./cookies.json
```
2. Place your CV in `assets/cv.txt`
3. Ensure all directories exist:

## Usage

### Basic Usage

1. Start the bot:
```bash
yarn start
```
2. For development with hot reload
```bash
yarn dev
```
3. Run tests
```bash
yarn test
```


## Core Components

### 1. Browser Automation (src/services/browser.ts)
- Configurable browser instance
- Viewport management
- Performance optimization

### 2. Authentication (src/services/auth.ts)
- Cookie-based session management
- Automatic login handling
- Session persistence

### 3. Job Search (src/services/jobService.ts)
- Customizable job search
- Result filtering
- Data extraction

### 4. OpenAI Integration (src/services/openAiService.ts)
- Cover letter generation
- Content optimization
- API management

## Configuration Options

### Browser Options
- `BROWSER_HEADLESS`: Run in headless mode
- `BROWSER_SLOW_MO`: Slow down operations for debugging
- `BROWSER_WIDTH/HEIGHT`: Viewport dimensions
- `BROWSER_TIMEOUT`: Operation timeout

### OpenAI Options
- `OPENAI_MODEL`: GPT model selection
- `OPENAI_MAX_TOKENS`: Token limit
- `OPENAI_SECRET_KEY`: API authentication

### Authentication Options
- `COOKIES_ENABLED`: Enable cookie persistence
- `COOKIES_PATH`: Cookie storage location
- `COOKIES_MAX_AGE`: Cookie validity period

## Logging

The application maintains detailed logs in:
- `logs/combined.log`: All application logs
- `logs/error.log`: Error-specific logs

Log levels:
- ERROR: Critical failures
- INFO: General operation information
- DEBUG: Detailed debugging information

## Testing

### Running Tests
Run all tests
```bash
yarn test
```

Run tests in watch mode
```bash
yarn test:watch
```

Run specific test file
```bash
yarn test --file=path/to/test/file.test.ts
```


### Test Structure
- Integration tests
- Service unit tests
- Utility function tests


## Troubleshooting

### Common Issues

1. Login Failures

- Check your credentials in `.env`
```
DJINNI_EMAIL=correct@email.com
DJINNI_PASS=correct_password
```
2. OpenAI API Issues
- Verify API key and model
```
OPENAI_SECRET_KEY=valid_key
OPENAI_MODEL=gpt-4-turbo-preview
```

3. Browser Automation Problems
```
BROWSER_HEADLESS=false
BROWSER_SLOW_MO=100
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

Use this bot responsibly and in accordance with Djinni.co's terms of service. The authors are not responsible for any misuse of this tool or violations of terms of service.


## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
