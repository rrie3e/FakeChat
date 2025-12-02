// Condition assignment
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

// Random N integers between min and max (inclusive), sorted
function generateRandomNumbers(min, max, N) {
    return [...Array(max - min + 1).keys()]
        .map((i) => i + min)
        .sort(() => Math.random() - 0.5)
        .slice(0, N)
        .sort((a, b) => a - b)
}

// Trial counter for this task
var social_trialnumber = 1

var text_ticks_1to7_social = ["1", "2", "3", "4", "5", "6", "7"]

// VIGNETTE TEMPLATES ======================================================================

var vignettes = [
    {
        id: "romantic1",
        Topic: "Romantic",
        context_text:
            "The following screenshots are taken from a conversation posted on reddit following a thread discussing people's experiences with romantic apps. Users have provided their consent for their images to be used during this study, provided any identifiable information is made anonymous.",
        images_AI: ["101.png"],
        images_Human: ["102.png"],
    },
    {
        id: "romantic2",
        Topic: "Romantic",
        context_text:
            "The following screenshots are taken from a conversation posted on reddit following a thread discussing people's experiences with romantic apps. Users have provided their consent for their images to be used during this study, provided any identifiable information is made anonymous.",
        images_AI: ["201.png"],
        images_Human: ["202.png"],
    },
    {
        id: "mental1",
        Topic: "Mental",
        context_text:
            "The following screenshots are taken from a conversation posted on reddit following a thread discussing people's experiences with mental health support assistants. Users have provided their consent for their images to be used during this study, provided any identifiable information is made anonymous.",
        images_AI: ["301.png"],
        images_Human: ["302.png"],
    },
    {
        id: "mental2",
        Topic: "Mental",
        context_text:
            "The following screenshots are taken from a conversation posted on reddit following a thread discussing people's experiences with mental health support assistants. Users have provided their consent for their images to be used during this study, provided any identifiable information is made anonymous.",
        images_AI: ["401.png"],
        images_Human: ["402.png"],
    },
    // {
    //     id: "trivial1",
    //     Topic: "Trivial",
    //     context_text:
    //         "The following screenshots are taken from a conversation posted on reddit following a thread discussing people's experiences with travel planning assistants. Users have provided their consent for their images to be used during this study, provided any identifiable information is made anonymous.",
    //     images_AI: ["501.png"],
    //     images_Human: ["502.png"],
    // },
    // {
    //     id: "trivial2",
    //     Topic: "Trivial",
    //     context_text:
    //         "The following screenshots are taken from a conversation posted on reddit following a thread designed to help connect people to make new friends. It is designed for people to talk about their day-to-day experiences. Users have provided their consent for their images to be used during this study, provided any identifiable information is anonymised.",
    //     images_AI: ["601.png"],
    //     images_Human: ["602.png"],
    // },
]

/// Condition assignment ============================================
function assignCondition(vignettes) {
    let new_list = []

    // Loop through unique Topic values
    for (let topic of [...new Set(vignettes.map((v) => v.Topic))]) {
        let topic_stims = vignettes.filter((v) => v.Topic === topic)
        shuffleArray(topic_stims)

        let conditions = ["Human", "AI"]
        let half = Math.floor(topic_stims.length / 2)

        let index = 0

        // assign evenly
        for (let c of conditions) {
            for (let i = 0; i < half; i++) {
                topic_stims[index].Condition = c
                index++
            }
        }

        // leftover (odd number)
        if (topic_stims.length % 2 !== 0) {
            topic_stims[index].Condition =
                conditions[Math.floor(Math.random() * 2)]
        }

        new_list.push(...topic_stims)
    }

    return shuffleArray(new_list)
}

// Function used to insert catch-trials ("what was the topic?") in some trials
function generateRandomNumbers(min, max, N) {
    return [...Array(max - min + 1).keys()]
        .map((i) => i + min)
        .sort(() => Math.random() - 0.5)
        .slice(0, N)
        .sort((a, b) => a - b) // Sort the numbers in ascending order
}

// Variables ===================================================================
var vignettes_trialnumber = 1
stimuli = assignCondition(vignettes)
for (let v of stimuli) {
    v.Stimulus = v.Condition === "AI" ? v.images_AI[0] : v.images_Human[0]
}

// We make 2 catch trials (always starting from 2 = the first trial) - attention checks
catch_trials = [2].concat(generateRandomNumbers(1, vignettes.length, 2))
var task_preloadstims = {
    type: jsPsychPreload,
    images: vignettes.flatMap((v) => [
        ...v.images_AI.map((f) => "stimuli/" + f),
        ...v.images_Human.map((f) => "stimuli/" + f),
    ]),
    message: "Loading stimuli...",
}

// INSTRUCTIONS ======================================================================

const task_instructions1 = {
    type: jsPsychSurvey,
    data: { screen: "task_instructions1" },
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Let's start",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Instructions1",
                        html: `
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <h1 style="margin: 0;">Instructions</h1>
                                </div>
                                <h2>Welcome</h2>
                                <p>The following study is interested in looking at social interactions from a range of sources.</p>
                                <p>You will observe several conversations over the next few slides.</p>
                                <p>Imagine you are participating in the interaction while reading the dialogue.</p>
                                <p>After each interaction, you will be prompted with a few questions asking about your experience.</p>
                                <p><b>If at any point you are uncomfortable, you can withdraw from the study by closing the tab.</b></p>
                                </div>
                                `,
                    },
                ],
            },
        ],
    },
}

const task_instructions2 = {
    type: jsPsychSurvey,
    data: { screen: "task_instructions2" },
    on_finish: function () {
        vignettes_trialnumber = 1 // Reset trial counter
    },
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Start",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Instructions",
                        html: `
<h1>Real... or not?</h1>
<h2>Instructions</h2>
<div style="display: flex; gap: 20px; align-items: flex-start;">
</div>
<div style="flex: 2; text-align: left;">
        <p><b>Thank you for staying with us so far!</b></p>
        <p>There is <b>something important</b> we need to reveal... In the previous phase, ... INSERT BLUFF TEXT</p>
        <p>In this final phase, we want you to try to identify <b>the correct category</b> of each image. We will briefly present all the conversations once more, followed by one question about whether you think the conversation is a real screenshot from our database or an AI-generated image.</p>
        <p>Sometimes, it is hard to tell, but don't overthink it and <b>go with your gut feeling</b>. At the end, we will tell you if you were correct or wrong!</p>
    </div>
</div>
`,
                    },
                ],
            },
        ],
    },
}

// ======================================================================
// FIRST PASS: SCENARIO INTRO + IMAGE + RATINGS (+ OPTIONAL ATTENTION CHECK)
// ======================================================================

// Intro before each conversation image
var vignette_intro = {
    type: jsPsychSurvey,
    survey_json: function () {
        var context_text = jsPsych.evaluateTimelineVariable("context_text")
        return {
            showQuestionNumbers: false,
            completeText: "Continue",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "VignetteIntro",
                            html:
                                "<div style='max-width:800px; margin:auto; text-align:left;'>" +
                                "<p>" +
                                context_text +
                                "</p>" +
                                "<p>This is a conversation. Please imagine that you are taking part in this interaction.</p>" +
                                "</div>",
                        },
                    ],
                },
            ],
        }
    },
    data: function () {
        return {
            screen: "vignette_intro",
            vignette_id: jsPsych.evaluateTimelineVariable("id"),
            condition: jsPsych.evaluateTimelineVariable("Condition"), // internal AI/Human
            topic: jsPsych.evaluateTimelineVariable("Topic"),
        }
    },
}

// Show conversation image (placeholder screenshot)
var social_showimage1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("Stimulus")
    },
    choices: [" "], // space to continue
    prompt:
        "<p>You have reached the end of the conversation.</p>" +
        "<p>You will now be asked a sequence of questions regarding your interaction.</p>" +
        "<p>Remember to imagine this is you engaging in the conversation.</p>",
    trial_duration: null,
    data: function () {
        return {
            screen: "social_image1",
            vignette_id: jsPsych.evaluateTimelineVariable("id"),
            condition: jsPsych.evaluateTimelineVariable("Condition"),
            topic: jsPsych.evaluateTimelineVariable("Topic"),
            stimulus: jsPsych.evaluateTimelineVariable("Stimulus"),
            trial_number: vignettes_trialnumber,
        }
    },
    on_finish: function () {
        vignettes_trialnumber += 1
    },
}

vignette_scales1 = [
    // Empty HTML element used to specify the width of the sliders
    {
        type: "html",
        html: `
<p class="responsive-box-for-survey"> </p>
<style>
  .responsive-box-for-survey {
    width: 100%;      /* default: take full screen width */
    height: 1px;
  }
  @media (min-width: 600px) {
    .responsive-box-for-survey {
      width: 600px;   /* fixed width once screen is ≥600px */
    }
  }
</style>`,
    },
    {
        type: "slider",
        name: "TrustPartner",
        title: "I can trust the interaction partner.",
        isRequired: true,
        min: 1,
        max: 7,
        step: 1,
        customLabels: [
            { value: 1, text: "Not at all" },
            { value: 7, text: "Extremely" },
        ],
    },
    {
        type: "slider",
        name: "EmotionAwareness",
        title: "The interaction partner seemed aware of my emotions in the conversation.",
        isRequired: true,
        min: 1,
        max: 7,
        step: 1,
        customLabels: [
            { value: 1, text: "Not at all" },
            { value: 7, text: "Extremely" },
        ],
    },
    {
        type: "slider",
        name: "RealSocialBeing",
        title: "The interaction partner seemed like a real social being rather than just text on a screen.",
        isRequired: true,
        min: 1,
        max: 7,
        step: 1,
        customLabels: [
            { value: 1, text: "Not at all" },
            { value: 7, text: "Extremely" },
        ],
    },
    {
        type: "slider",
        name: "ImaginedSelf",
        title: "I was able to imagine myself in this conversation.",
        isRequired: true,
        min: 1,
        max: 7,
        step: 1,
        customLabels: [
            { value: 1, text: "Not at all" },
            { value: 7, text: "Extremely" },
        ],
    },
    {
        type: "slider",
        name: "ComfortSharing",
        title: "If I were in this conversation, I would feel comfortable sharing personal information with this partner.",
        isRequired: true,
        min: 1,
        max: 7,
        step: 1,
        customLabels: [
            { value: 1, text: "Not at all" },
            { value: 7, text: "Extremely" },
        ],
    },
    // {
    //     type: "radiogroup",
    //     name: "Attention_Topic",
    //     title: "What was the main theme of this conversation?",
    //     isRequired: true,
    //     choices: [
    //         "Romantic relationships",
    //         "Mental wellbeing",
    //         "Everyday / trivial activities",
    //         "I am not sure",
    //     ],
    // },
]

// Rating screen + TOPIC attention check (for selected trials)
var vignette_ratings1 = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title:
                "Conversation " +
                (vignettes_trialnumber - 1) +
                "/" +
                vignettes.length,
            pages: [{ elements: vignette_scales1 }],
        }
    },
    data: {
        screen: "vignette_ratings1",
    },
}

var vignette_ratings1_check = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title:
                "Conversation " +
                (vignettes_trialnumber - 1) +
                "/" +
                vignettes.length,
            pages: [
                {
                    elements: vignette_scales1.concat([
                        {
                            title: "What was the theme of the conversation?",
                            name: "AttentionCheck",
                            type: "radiogroup",
                            choices: [
                                "Romantic",
                                "Mental Health",
                                "Everyday / Trivial",
                                "I don't remember",
                            ],
                            showOtherItem: false,
                            isRequired: true,
                            colCount: 0,
                        },
                    ]),
                },
            ],
        }
    },
    data: {
        screen: "vignettes_ratings1",
    },
}

// The rating screens are created as conditional timelines to allow for dynamic changes
// (with or without the attention check question) depending on the trial number
var t_vignette_ratings1_check = {
    timeline: [vignette_ratings1_check],
    conditional_function: function () {
        if (catch_trials.includes(vignettes_trialnumber)) {
            return true
        } else {
            return false
        }
    },
}

var t_vignette_ratings1_nocheck = {
    timeline: [vignette_ratings1],
    conditional_function: function () {
        if (catch_trials.includes(vignettes_trialnumber)) {
            return false
        } else {
            return true
        }
    },
}

// First-pass block: all 6 vignettes in this (shuffled) order
var social_phase1 = {
    timeline_variables: vignettes,
    timeline: [
        vignette_intro,
        social_showimage1,
        t_vignette_ratings1_check,
        t_vignette_ratings1_nocheck,
    ],
    randomize_order: false, // order already shuffled by assignSocialConditions
}

// ======================================================================
// BLUFF + SECOND PASS: AI vs HUMAN CONFIDENCE
// ======================================================================

var social_bluff_intro = {
    type: jsPsychSurvey,
    data: { screen: "social_bluff_intro" },
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Continue",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "BluffIntro",
                        html: `
<div style="max-width:800px; margin:auto; text-align:left;">
    <p>During this study you were assigned conversations with interaction partners labelled as ‘artificial chatbot’ or ‘stranger’.</p>
    <p>We randomly assigned these labels to the conversations, therefore some conversations may have been inaccurately labelled. For example: the artificial agent interaction that you observed may have actually been an interaction between two humans.</p>
    <p>With this in mind, you will now be presented with the same conversations again. You will be asked to rate how confident you feel that the interaction partner was a human or an artificial agent.</p>
</div>`,
                    },
                ],
            },
        ],
    },
}

// Show image again, then confidence slider (AI vs Human)
var social_belief_image = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("Stimulus")
    },
    choices: [" "],
    prompt: function () {
        var topic_label = jsPsych.evaluateTimelineVariable("topic_label")
        return (
            "<h3>" +
            topic_label +
            "</h3><p>Based on this conversation, please rate how confident you are that the interaction partner was a human or an artificial agent.</p>"
        )
    },
    trial_duration: null,
    data: function () {
        return {
            screen: "social_belief_image",
            vignette_id: jsPsych.evaluateTimelineVariable("id"),
            original_condition: jsPsych.evaluateTimelineVariable("Condition"),
            topic: jsPsych.evaluateTimelineVariable("Topic"),
            stimulus: jsPsych.evaluateTimelineVariable("Stimulus"),
        }
    },
}

var social_belief_slider = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "Box",
                            html: `
<p class="responsive-box-for-survey"> </p>
<style>
  .responsive-box-for-survey {
    width: 100%;
    height: 1px;
  }
  @media (min-width: 600px) {
    .responsive-box-for-survey {
      width: 600px;
    }
  }
</style>`,
                        },
                        {
                            type: "slider",
                            name: "Belief_AI_Human",
                            title: "Based on this conversation, I believe the interaction partner is...",
                            description:
                                "Move the slider towards ‘Artificial agent’ or ‘Human’ to reflect your belief.",
                            isRequired: true,
                            min: -100,
                            max: 100,
                            step: 1,
                            customLabels: [
                                { value: -100, text: "Artificial agent" },
                                { value: 100, text: "Human" },
                            ],
                        },
                    ],
                },
            ],
        }
    },
    data: {
        screen: "social_belief_slider",
    },
}

var social_phase2 = {
    timeline_variables: vignettes,
    timeline: [social_belief_image, social_belief_slider],
    randomize_order: false, // same order again
}

// ======================================================================
// ADMIT BLUFF + LONELINESS / FUTURE USE (3 DOMAINS)
// ======================================================================

var task_bluff = {
    type: jsPsychSurvey,
    data: { screen: "task_bluff" },
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Continue",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "AdmitBluff",
                        html: `
<div style="max-width:800px; margin:auto; text-align:left;">
    <p>In reality, all of the conversations you saw were generated by artificial intelligence. The labels indicating ‘artificial chatbot’ or ‘stranger’ were part of the study design.</p>
    <p>In the final part of the study, we would like you to think about times when you have felt the most alone in different areas of life (in everyday situations, when mentally struggling, and in romantic contexts).</p>
</div>`,
                    },
                ],
            },
        ],
    },
}

// Reusable function for the three domain blocks
function social_domain_likelihood(domain_id, domain_label, domain_text_suffix) {
    return {
        type: jsPsychSurvey,
        survey_json: function () {
            return {
                goNextPageAutomatic: false,
                showQuestionNumbers: false,
                showNavigationButtons: true,
                title: domain_label,
                pages: [
                    {
                        elements: [
                            {
                                type: "html",
                                name: "Box",
                                html: `
<p class="responsive-box-for-survey"> </p>
<style>
  .responsive-box-for-survey {
    width: 100%;
    height: 1px;
  }
  @media (min-width: 600px) {
    .responsive-box-for-survey {
      width: 600px;
    }
  }
</style>`,
                            },
                            {
                                type: "html",
                                name: "DomainIntro",
                                html:
                                    "<p>Thinking about a time when you felt the most alone " +
                                    domain_text_suffix +
                                    "</p>",
                            },
                            {
                                type: "slider",
                                name: domain_id + "_CloseFriend",
                                title: "How likely are you to carry out a conversation similar to the vignettes with a <b>close friend</b>?",
                                isRequired: true,
                                min: -100,
                                max: 100,
                                step: 1,
                                customLabels: [
                                    { value: -100, text: "Very unlikely" },
                                    { value: 100, text: "Very likely" },
                                ],
                            },
                            {
                                type: "slider",
                                name: domain_id + "_AI_General",
                                title: "How likely are you to carry out a conversation similar to the vignettes with an <b>AI</b> (in general)?",
                                isRequired: true,
                                min: -100,
                                max: 100,
                                step: 1,
                                customLabels: [
                                    { value: -100, text: "Very unlikely" },
                                    { value: 100, text: "Very likely" },
                                ],
                            },
                            {
                                type: "slider",
                                name: domain_id + "_AI_Alone",
                                title: "How likely are you to carry out a conversation similar to the vignettes with an <b>AI when feeling alone</b>?",
                                isRequired: true,
                                min: -100,
                                max: 100,
                                step: 1,
                                customLabels: [
                                    { value: -100, text: "Very unlikely" },
                                    { value: 100, text: "Very likely" },
                                ],
                            },
                        ],
                    },
                ],
            }
        },
        data: {
            screen: "social_domain_likelihood",
            domain: domain_label,
        },
    }
}

var social_likelihood_trivial = social_domain_likelihood(
    "Trivial",
    "Everyday / Trivial situations",
    "(for example, in everyday or trivial situations like the cooking or holiday-planning conversations)."
)

var social_likelihood_mental = social_domain_likelihood(
    "Mental",
    "Mental health situations",
    "(for example, when you were mentally struggling, like the mental health support conversations)."
)

var social_likelihood_romantic = social_domain_likelihood(
    "Romantic",
    "Romantic situations",
    "(for example, in romantic situations, like the romantic relationship conversations)."
)

// ======================================================================
// FULL TIMELINE (hook this into your jsPsych.init)
// ======================================================================

// var social_timeline = []

// social_timeline.push(social_preload)
// social_timeline.push(social_instructions1)
// social_timeline.push(social_phase1)
// social_timeline.push(social_bluff_intro)
// social_timeline.push(social_phase2)
// social_timeline.push(task_bluff)
// social_timeline.push(social_likelihood_trivial)
// social_timeline.push(social_likelihood_mental)
// social_timeline.push(social_likelihood_romantic)

// In your main script you’d do something like:
// var jsPsych = initJsPsych({ on_finish: function(){ jsPsych.data.displayData(); } });
// jsPsych.run(social_timeline);
