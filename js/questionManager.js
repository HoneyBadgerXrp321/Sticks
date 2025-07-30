// Question Manager - Handles trivia questions and typing effects
class QuestionManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.totalQuestions = 40; // Randomly select 40 from available questions
        this.isTyping = false;
        this.typingSpeed = 50; // milliseconds per character
        this.currentText = '';
        this.targetText = '';
        this.typingInterval = null;
        this.timeExpired = false; // Track if timer has expired for current question
        this.currentShuffledAnswers = null; // Store shuffled answers for current question
        
        this.generateSampleQuestions();
    }

    // Fisher-Yates shuffle algorithm for randomizing array order
    shuffleArray(array) {
        const shuffled = [...array]; // Create a copy to avoid modifying original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Randomly select a subset of questions
    selectRandomQuestions(allQuestions, count) {
        const shuffled = this.shuffleArray(allQuestions);
        return shuffled.slice(0, count);
    }

    generateSampleQuestions() {
        // Real trivia questions from TRIVIA_Fixed_Final.txt (Updated Version)
        const realQuestions = [
            {
                question: "When did Bearableguy123 first post the number 589?",
                answers: ["February 14, 2018", "December 19, 2019", "March 26, 2023", "Internet meme"],
                correct: 0
            },
            {
                question: "What does 5 × 8 × 9 equal?",
                answers: ["589", "360", "985", "Dogecoin fork"],
                correct: 1
            },
            {
                question: "What is the atomic weight of cobalt?",
                answers: ["589.00", "58.933", "98.500", "45.679"],
                correct: 1
            },
            {
                question: "What are Nostro and Vostro accounts used for?",
                answers: ["Creating NFTs", "Cross-border bank transactions", "Mining Bitcoin", "Gaming leaderboards"],
                correct: 1
            },
            {
                question: "According to Bearableguy's Loadstar essay, what does 589 represent?",
                answers: ["A fake prophecy", "Nostro/Vostro accounts unleashed", "A secret wallet address", "IMF restructuring"],
                correct: 1
            },
            {
                question: "Which date is 58.9% through the year?",
                answers: ["August 2", "July 22", "September 5", "June 18"],
                correct: 0
            },
            {
                question: "What file did the SEC release on May 8, 2009?",
                answers: ["98589", "34-59895", "BG-589", "33-11334"],
                correct: 1
            },
            {
                question: "Who wrote the National Treasure movie script?",
                answers: ["David Schwartz", "Charles Segars", "Nicolas Cage", "Jerry Bruckheimer"],
                correct: 1
            },
            {
                question: "What government role did Charles Segars once hold?",
                answers: ["CIA director", "White House security consultant", "Federal Reserve advisor", "Homeland archivist"],
                correct: 1
            },
            {
                question: "What is the name of Benjamin Gates' sidekick?",
                answers: ["Chris Pool", "Riley Pool", "Parker Ripple", "Billy Bookman"],
                correct: 1
            },
            {
                question: "What department in the FBI was mentioned in the National Treasure series?",
                answers: ["Cyber Crimes", "Cryptanalysis", "Behavioral Analysis", "Code Cracking Division"],
                correct: 1
            },
            {
                question: "What kind of painting is in both Bearableguy's riddle and National Treasure?",
                answers: ["Storm at sea", "Gold-framed Spanish ship", "Sunset on the Hudson", "British naval battle"],
                correct: 1
            },
            {
                question: "What iconic movie prop resembled Bearableguy's clock?",
                answers: ["Illuminati mirror", "National Treasure's gold-revealing wheel", "Declaration vault", "Eye of Providence"],
                correct: 1
            },
            {
                question: "What rug was discovered in Bearableguy123's Christmas riddle?",
                answers: ["Moroccan Blue Runner", "Persian Classic Red Medallion", "Ripple Lodge Carpet", "Federal Mint Mat"],
                correct: 1
            },
            {
                question: "Which Ripple executive posted a GPS image that hinted at Route 123?",
                answers: ["Brad Garlinghouse", "David Schwartz", "Stuart Alderoty", "Monica Long"],
                correct: 1
            },
            {
                question: "What suit brand was linked to David Schwartz's ski outfit?",
                answers: ["Columbia", "Shinesty", "Patagonia", "Mountain Mafia"],
                correct: 1
            },
            {
                question: "What day did Trump tweet he was a \"stable genius\"?",
                answers: ["January 6, 2018", "February 9, 2019", "December 12, 2020", "March 1, 2017"],
                correct: 0
            },
            {
                question: "What was shown in Trump's hand in both riddler tweets and CNBC images?",
                answers: ["Ripple patent", "XRP logo", "Golden key", "MAGA coin"],
                correct: 1
            },
            {
                question: "What statue did Trump bring into the Oval Office on Inauguration Day?",
                answers: ["Teddy Roosevelt bust", "Winston Churchill bust", "The Ripple Flame", "Ronald Reagan figure"],
                correct: 1
            },
            {
                question: "What XRP-related location is owned by Trump?",
                answers: ["1600 Pennsylvania Ave", "Ripple headquarters at 315 Montgomery St", "Dubai Trade Zone", "Trump Crypto Tower"],
                correct: 1
            },
            {
                question: "What phrase did David Schwartz tweet about Bearableguy123 returning?",
                answers: ["They're real", "They're baaaack!", "The riddler rises", "Can't stop fate"],
                correct: 1
            },
            {
                question: "What old riddle book mirrors David Schwartz's riddle style?",
                answers: ["The Great Puzzle Bear", "Bearly-Bearable", "Crypto Bear Code", "Puzzle & Protocol"],
                correct: 1
            },
            {
                question: "What song lyric did David Schwartz reference before XRP pumped?",
                answers: ["Bow down before the one you serve", "Trust the system", "When moon meets tide", "Banking on belief"],
                correct: 0
            },
            {
                question: "What price was XRP when Schwartz posted the \"bow down\" riddle?",
                answers: ["$0.32", "$0.54", "$1.00", "$0.93"],
                correct: 1
            },
            {
                question: "Which president was known as the \"Trustbuster\"?",
                answers: ["Lincoln", "Teddy Roosevelt", "Eisenhower", "Andrew Jackson"],
                correct: 1
            },
            {
                question: "What movie does David Schwartz often reference in his riddles?",
                answers: ["The Matrix", "Ghostbusters", "Interstellar", "Fight Club"],
                correct: 1
            },
            {
                question: "What phrase is Teddy Roosevelt known for?",
                answers: ["Power flows through control", "Speak softly and carry a big stick", "Drain the system with force", "Manifest ledger"],
                correct: 1
            },
            {
                question: "What object is in the hand of the bear inside the bear's den riddle?",
                answers: ["A golden XRP coin", "A hammer", "A riddle scroll", "A compass"],
                correct: 1
            },
            {
                question: "What book did Brett Baier write?",
                answers: ["Teddy Roosevelt and the Ghosts of Power", "Teddy Roosevelt and the Birth of a Superpower", "Roosevelt: The Last Riddler", "The Ledger of Liberty"],
                correct: 1
            },
            {
                question: "What store did David Schwartz tweet about that sells red superhero masks?",
                answers: ["Hero Outfitters", "Superhero Supply Store", "Teddy Gear Co.", "LedgerWear"],
                correct: 1
            },
            {
                question: "What was Teddy Roosevelt's greatest achievement according to historians?",
                answers: ["Founding the Fed", "Building the Panama Canal", "Creating the National Park Service", "Ending WWI"],
                correct: 1
            },
            {
                question: "What disease did Roosevelt fight during the canal construction?",
                answers: ["Polio", "Malaria", "Tuberculosis", "Yellow Fever"],
                correct: 1
            },
            {
                question: "What object does Ripple founder Chris Larsen use to metaphorize payments tech?",
                answers: ["Rocket ship", "Shipping container", "Digital vault", "Blockchain bridge"],
                correct: 1
            },
            {
                question: "What bear cartoon appeared before the Federal Reserve was created?",
                answers: ["The BG Files", "The Roosevelt Bears", "National Bear Code", "Ledger Bears"],
                correct: 1
            },
            {
                question: "What letters appeared on the elevator in Night at the Museum?",
                answers: ["XRP589", "BG123", "BGSCH", "MMTDL"],
                correct: 1
            },
            {
                question: "Who was frozen in the same pose as the BG123 riddle in Night at the Museum?",
                answers: ["George Washington", "Teddy Roosevelt", "Abraham Lincoln", "Alexander Hamilton"],
                correct: 1
            },
            {
                question: "What was Ben Stiller's production company logo?",
                answers: ["A bear holding a cane", "A three-belled jester", "A yellow owl with stars", "A spinning key"],
                correct: 1
            },
            {
                question: "What phrase appears in the riddle Teddy Roosevelt liked?",
                answers: ["The world is math", "Perception is power", "The world is a stage", "Truth is structured"],
                correct: 2
            },
            {
                question: "What was the name of the White House riddle book?",
                answers: ["The Golden Bear's Code", "Teddy Roosevelt and the Treasure of Ursa Major", "The Owl of Washington", "The Executive Cipher"],
                correct: 1
            },
            {
                question: "What was the purpose of The Roosevelt Bears' story journey?",
                answers: ["Visit churches", "Explore cities later used for Federal Reserve banks", "Search for treasure", "Map gold reserves"],
                correct: 1
            },
            {
                question: "What real-life item may the red BG character represent?",
                answers: ["A puppet", "A ragdoll", "A voodoo doll", "A paper token"],
                correct: 2
            },
            {
                question: "What celestial event is being connected to XRP in the video?",
                answers: ["Solar eclipse", "T Coronae Borealis nova", "Meteor shower", "Venus alignment"],
                correct: 1
            },
            {
                question: "What phrase is used repeatedly to connect Ripple with global change?",
                answers: ["Shock the System", "Flip the Ledger", "Ripples of Change", "Digital Avalanche"],
                correct: 2
            },
            {
                question: "Which UN-backed alliance selected Ripple to help promote digital payments?",
                answers: ["Better Than Cash Alliance", "Blockchain World Forum", "Tokenized Equity Council", "Decentralized Finance Network"],
                correct: 0
            }
        ];

        // Randomly select 40 questions from all available questions
        const selectedQuestions = this.selectRandomQuestions(realQuestions, this.totalQuestions);
        
        // Shuffle the selected questions for random order
        this.questions = this.shuffleArray(selectedQuestions);
        
        console.log(`Randomly selected and shuffled ${this.questions.length} questions from ${realQuestions.length} available`);
    }

    getCurrentQuestion() {
        if (this.currentQuestionIndex < this.questions.length) {
            return this.questions[this.currentQuestionIndex];
        }
        return null;
    }

    showQuestion() {
        const question = this.getCurrentQuestion();
        if (!question) return;

        // Show question interface
        const questionInterface = document.getElementById('questionInterface');
        questionInterface.classList.remove('hidden');

        // Start typing animation for question text
        this.startTypingAnimation(question.question);

        // Create randomized answer array with original indices
        const answersWithIndices = question.answers.map((answer, index) => ({
            text: answer,
            originalIndex: index,
            isCorrect: index === question.correct
        }));

        // Shuffle the answers
        const shuffledAnswers = this.shuffleArray(answersWithIndices);

        // Store the shuffled answers for validation later
        this.currentShuffledAnswers = shuffledAnswers;

        // Set up answer buttons with shuffled answers
        const answerButtons = [
            document.getElementById('answer1'),
            document.getElementById('answer2'),
            document.getElementById('answer3'),
            document.getElementById('answer4')
        ];

        answerButtons.forEach((button, index) => {
            button.textContent = shuffledAnswers[index].text;
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
            
            // Remove existing event listeners
            button.replaceWith(button.cloneNode(true));
        });

        // Re-get buttons after cloning and add new event listeners
        const newAnswerButtons = [
            document.getElementById('answer1'),
            document.getElementById('answer2'),
            document.getElementById('answer3'),
            document.getElementById('answer4')
        ];

        newAnswerButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.selectAnswer(index));
        });
    }

    startTypingAnimation(text) {
        this.targetText = text;
        this.currentText = '';
        this.isTyping = true;
        
        const questionTextElement = document.getElementById('questionText');
        questionTextElement.textContent = '';

        let charIndex = 0;
        this.typingInterval = setInterval(() => {
            if (charIndex < this.targetText.length) {
                this.currentText += this.targetText[charIndex];
                questionTextElement.textContent = this.currentText;
                charIndex++;
            } else {
                this.isTyping = false;
                clearInterval(this.typingInterval);
            }
        }, this.typingSpeed);
    }

    selectAnswer(selectedIndex) {
        if (this.isTyping || this.timeExpired) return; // Don't allow selection while typing or if time expired

        const question = this.getCurrentQuestion();
        if (!question || !this.currentShuffledAnswers) return;

        const answerButtons = [
            document.getElementById('answer1'),
            document.getElementById('answer2'),
            document.getElementById('answer3'),
            document.getElementById('answer4')
        ];

        // Disable all buttons
        answerButtons.forEach(button => button.disabled = true);

        // Show correct/incorrect feedback based on shuffled positions
        answerButtons.forEach((button, index) => {
            if (this.currentShuffledAnswers[index].isCorrect) {
                button.classList.add('correct');
            } else if (index === selectedIndex && !this.currentShuffledAnswers[index].isCorrect) {
                button.classList.add('incorrect');
            }
        });

        // Check if the selected answer is correct
        const isCorrect = this.currentShuffledAnswers[selectedIndex].isCorrect;
        
        // Notify game engine of the result
        setTimeout(() => {
            this.hideQuestion();
            if (window.gameEngine) {
                window.gameEngine.handleAnswerResult(isCorrect);
            }
        }, 2000); // Show feedback for 2 seconds
    }

    hideQuestion() {
        const questionInterface = document.getElementById('questionInterface');
        questionInterface.classList.add('hidden');
        
        // Clear typing animation
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        return this.currentQuestionIndex < this.totalQuestions;
    }

    getProgress() {
        return {
            current: this.currentQuestionIndex + 1,
            total: this.totalQuestions,
            percentage: ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100
        };
    }

    reset() {
        this.currentQuestionIndex = 0;
        this.hideQuestion();
        
        // Generate a new random set of questions for replay
        this.generateSampleQuestions();
        console.log('Questions reshuffled for new game');
    }
}
