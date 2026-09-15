/* ==========================================================================
   THE 5-QUESTION SELF-ASSESSMENT — edit this file to change the quiz.

   HOW SCORING WORKS
   - Questions tagged  skill       measure where your game is  (0-3 points each)
   - Questions tagged  commitment  measure how serious you are (0-3 points each)
   - Skill points add up to 0-9 and pick a band from LEVEL_BANDS below.
   - Commitment points add up to 0-6 and pick a note from COMMITMENT below.
   - Each skill answer can name a `focus` — the lowest-scoring answers become
     the "what to work on" list. Leave focus off an answer to skip it.

   To add a question, copy a block and keep the same shape. To reword an
   answer, just change its `label`. Points must stay 0-3.
   ========================================================================== */

window.P4W_QUIZ = {

  questions: [
    {
      id: "experience",
      type: "skill",
      q: "How long have you been playing pickleball?",
      help: "Rough is fine — nobody's checking.",
      options: [
        { label: "I've never played",                      points: 0, focus: "The basics: rules, scoring, and how a rally is supposed to go" },
        { label: "A few times / under 6 months",           points: 1, focus: "Consistency — keeping the ball in play longer" },
        { label: "6 months to 2 years",                    points: 2 },
        { label: "Over 2 years",                           points: 3 }
      ]
    },
    {
      id: "kitchen",
      type: "skill",
      q: "At the kitchen line, how do dinks and resets feel?",
      help: "The kitchen is the no-volley zone right at the net.",
      options: [
        { label: "I don't know what those are",            points: 0, focus: "Kitchen-line basics: what the no-volley zone is and why it decides points" },
        { label: "I can dink a few before missing",        points: 1, focus: "Sustaining dink rallies without popping the ball up" },
        { label: "I sustain dinks and sometimes reset",    points: 2, focus: "Resetting under pressure instead of speeding up too early" },
        { label: "I reset reliably when I'm under pressure", points: 3 }
      ]
    },
    {
      id: "serve",
      type: "skill",
      q: "How about your serve and return?",
      options: [
        { label: "Still working on getting them in",       points: 0, focus: "Serve and return mechanics — repeatable contact first" },
        { label: "They go in, but I can't place them",     points: 1, focus: "Placing serves and returns instead of just landing them" },
        { label: "Consistent, and I can hit them deep",    points: 2, focus: "Using depth to take away your opponent's third shot" },
        { label: "Deep, with spin and variety on purpose", points: 3 }
      ]
    },
    {
      id: "frequency",
      type: "commitment",
      q: "How often are you playing right now?",
      options: [
        { label: "Rarely — whenever it happens",           points: 0 },
        { label: "About once a week",                      points: 1 },
        { label: "Two or three times a week",              points: 2 },
        { label: "Four or more times a week",              points: 3 }
      ]
    },
    {
      id: "goal",
      type: "commitment",
      q: "What are you hoping to get out of coaching?",
      options: [
        { label: "Learn the basics and have fun",          points: 0 },
        { label: "Hold my own in rec games",               points: 1 },
        { label: "Play local leagues and tournaments",     points: 2 },
        { label: "Push my rating as high as it'll go",     points: 3 }
      ]
    }
  ],

  /* Skill points (0-9) -> band. `max` is inclusive. */
  levelBands: [
    { max: 1, band: "2.0",       name: "Brand new",     blurb: "You're at the very start, which is a great place to be — everything you learn now sticks." },
    { max: 3, band: "2.0 – 2.5", name: "Beginner",      blurb: "You know what you're doing out there; the goal now is making it repeatable." },
    { max: 5, band: "2.5 – 3.0", name: "Developing",    blurb: "You can rally. The next jump comes from control at the kitchen line." },
    { max: 7, band: "3.0 – 3.5", name: "Intermediate",  blurb: "Solid all-around game. Now it's about shot selection and doing the right thing under pressure." },
    { max: 9, band: "3.5 – 4.0+", name: "Advanced",     blurb: "You've got the shots. Coaching at this level is about patterns, strategy, and sharpening the margins." }
  ],

  /* Commitment points (0-6) -> note + which option gets suggested. */
  commitment: [
    { max: 2, label: "Playing for fun",  note: "No pressure to commit to anything — come to a session when it suits you. If you've got a friend or two who play, the small group session is usually the most fun way in; on your own, take the individual lesson.", suggest: "group" },
    { max: 4, label: "Getting serious",  note: "You're playing enough that regular coaching will show up in your results fast.", suggest: "individual" },
    { max: 6, label: "All in",           note: "At this rate you'll get the most out of focused one-on-one work with a plan between sessions.", suggest: "individual" }
  ]
};
