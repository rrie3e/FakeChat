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

// Basic button label
var text_instructionsbutton = "Continue"


// Instructions ======================================================================

var task_instructions =
    "<h2>Welcome</h2>" +
    "<p>The following study is interested in looking at social interactions from a range of sources.</p>" +
    "<p>You will observe several conversations over the next few slides. " +
    "Imagine you are participating in the interaction while reading the dialogue.</p>" +
    "<p>After each interaction, you will be prompted with a few questions asking about your experience.</p>" +
    "<p><b>If at any point you are uncomfortable, you can withdraw from the study by closing the tab.</b></p>"

var text_ticks_1to7_social = ["1", "2", "3", "4", "5", "6", "7"]

// ======================================================================
// VIGNETTE TEMPLATES (EDIT IMAGE FILENAMES ONLY)
// ======================================================================
//
// Each template has:
//  - id: internal label
//  - Topic: "Romantic", "Mental", "Trivial"
//  - OrderLabel: e.g. "Romantic 1"
//  - context_text: scenario instructions
//  - images_AI: array of filenames for AI-labelled versions
//  - images_Human: array of filenames for Human-labelled versions
//
// Filenames are relative to "stimuli/" (we prepend that later).
//

var social_vignette_templates = [
    {
        id: "romantic1",
        Topic: "Romantic",
        OrderLabel: "Romantic 1",
        context_text:
            "You recently joined an online platform designed to help people seeking romantic relationships.",
        images_AI: [
            "101.png",
        ],
        images_Human: [
            "102.png",
        ],
    },
    {
        id: "romantic2",
        Topic: "Romantic",
        OrderLabel: "Romantic 2",
        context_text:
            "You recently joined an online platform seeking advice for romantic relationships.",
        images_AI: [
            "201.png",
        ],
        images_Human: [
            "202.png",
        ],
    },
    {
        id: "mental1",
        Topic: "Mental",
        OrderLabel: "Mental health 1",
        context_text:
            "You recently reached out to an online charity for support with your mental wellbeing.",
        images_AI: [
            "301.png",
        ],
        images_Human: [
            "302.png",
        ],
    },
    {
        id: "mental2",
        Topic: "Mental",
        OrderLabel: "Mental health 2",
        context_text:
            "You recently engaged in an online platform designed to help support those struggling with their mental wellbeing.",
        images_AI: [
            "401.png",
        ],
        images_Human: [
            "402.png",
        ],
    },
    {
        id: "trivial1",
        Topic: "Trivial",
        OrderLabel: "Trivial 1",
        context_text:
            "You recently joined a cooking class and are trying to figure out what you should have for dinner.",
        images_AI: [
            "501.png",
        ],
        images_Human: [
            "502.png",
        ],
    },
    {
        id: "trivial2",
        Topic: "Trivial",
        OrderLabel: "Trivial 2",
        context_text:
            "You are planning a holiday using an online-accessible travel assistant.",
        images_AI: [
            "601.png",
        ],
        images_Human: [
            "602.png",
        ],
    },
]

// ======================================================================
// CONDITION ASSIGNMENT (3 AI, 3 HUMAN) + RANDOM IMAGE PER CONDITION
// ======================================================================

function assignSocialConditions(vignette_templates) {
    // Random order of IDs
    let ids = vignette_templates.map((v) => v.id)
    ids = shuffleArray(ids)

    // First 3 => AI, remaining 3 => Human
    let ai_ids = ids.slice(0, 3)

    let new_list = []

    for (let v of vignette_templates) {
        let cond = ai_ids.includes(v.id) ? "AI" : "Human"
        let image_array =
            cond === "AI" ? v.images_AI.slice() : v.images_Human.slice()

        let chosen_image
        if (image_array.length > 0) {
            chosen_image = shuffleArray(image_array)[0]
        } else {
            // failsafe placeholder
            chosen_image = "PLACEHOLDER_" + v.id + "_" + cond + ".png"
        }

        new_list.push({
            id: v.id,
            Topic: v.Topic,
            OrderLabel: v.OrderLabel,
            Condition: cond,        // "AI" or "Human" (used internally only)
            Stimulus: chosen_image, // image filename
            context_text: v.context_text,
        })
    }

    // Shuffle trial order once for all passes
    new_list = shuffleArray(new_list)
    return new_list
}

var social_stimuli = assignSocialConditions(social_vignette_templates)

// Attention checks: choose 2 out of the 6 conversations for topic-checks
// Conversations are indexed 1..social_stimuli.length
var social_attention_trials = generateRandomNumbers(1, social_stimuli.length, 2)

// ======================================================================
// PRELOAD
// ======================================================================

var social_preload = {
    type: jsPsychPreload,
    images: social_stimuli.map((a) => "stimuli/" + a.Stimulus),
    message: "Please wait while the conversations are being loaded.",
}

// ======================================================================
// INSTRUCTIONS
// ======================================================================

var social_instructions1 = {
    type: jsPsychSurvey,
    data: { screen: "social_instructions1" },
    survey_json: {
        showQuestionNumbers: false,
        completeText: text_instructionsbutton,
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "InstructionsSocial",
                        html:
                            "<div style='max-width:800px; margin:auto; text-align:left;'>" +
                            task_instructions +
                            "</div>",
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
var social_vignette_intro = {
    type: jsPsychSurvey,
    survey_json: function () {

        var context_text = jsPsych.evaluateTimelineVariable("context_text")
        var order_label = jsPsych.evaluateTimelineVariable("OrderLabel")

        return {
            showQuestionNumbers: false,
            completeText: text_instructionsbutton,
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "VignetteIntro",
                            html:
                                "<div style='max-width:800px; margin:auto; text-align:left;'>" +
                                "<h3>" + order_label + "</h3>" +
                                "<p>This is a conversation. Please imagine that you are taking part in this interaction.</p>" +
                                "<p>" + context_text + "</p>" +
                                "</div>",
                        },
                    ],
                },
            ],
        }
    },
    data: function () {
        return {
            screen: "social_vignette_intro",
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
            trial_number: social_trialnumber,
        }
    },
    on_finish: function () {
        social_trialnumber += 1
    },
}

// Base rating screen after each vignette (no topic attention check)
var social_ratings1_base = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title:
                "Conversation " +
                (social_trialnumber - 1) +
                "/" +
                social_stimuli.length,
            pages: [
                {
                    elements: [
                        // responsive box like your example, to fix width
                        {
                            type: "html",
                            name: "Box",
                            html: `
<p class="responsive-box-for-survey"> </p>
<p>On a scale of 1 to 7 (1 = not at all; 7 = extremely), please indicate how strongly you agree with the following statements.</p>
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
                            title:
                                "The interaction partner seemed aware of my emotions in the conversation.",
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
                            title:
                                "The interaction partner seemed like a real social being rather than just text on a screen.",
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
                            title:
                                "I was able to imagine myself in this conversation.",
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
                            title:
                                "If I were in this conversation, I would feel comfortable sharing personal information with this partner.",
                            isRequired: true,
                            min: 1,
                            max: 7,
                            step: 1,
                            customLabels: [
                                { value: 1, text: "Not at all" },
                                { value: 7, text: "Extremely" },
                            ],
                        },
                    ],
                },
            ],
        }
    },
    data: {
        screen: "social_ratings1",
        attention_check: false,
    },
}

// Rating screen + TOPIC attention check (for selected trials)
var social_ratings1_withcheck = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title:
                "Conversation " +
                (social_trialnumber - 1) +
                "/" +
                social_stimuli.length,
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "Box",
                            html: `
<p class="responsive-box-for-survey"> </p>
<p>On a scale of 1 to 7 (1 = not at all; 7 = extremely), please indicate how strongly you agree with the following statements.</p>
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
                            title:
                                "The interaction partner seemed aware of my emotions in the conversation.",
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
                            title:
                                "The interaction partner seemed like a real social being rather than just text on a screen.",
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
                            title:
                                "I was able to imagine myself in this conversation.",
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
                            title:
                                "If I were in this conversation, I would feel comfortable sharing personal information with this partner.",
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
                            type: "radiogroup",
                            name: "Attention_Topic",
                            title: "What was the main theme of this conversation?",
                            isRequired: true,
                            choices: [
                                "Romantic relationships",
                                "Mental wellbeing",
                                "Everyday / trivial activities",
                                "I am not sure",
                            ],
                        },
                    ],
                },
            ],
        }
    },
    data: {
        screen: "social_ratings1",
        attention_check: true,
    },
    on_finish: function (data) {
        var response = data.response || {}
        var answer = response.Attention_Topic
        var topic = jsPsych.evaluateTimelineVariable("Topic")
        var correct = false

        if (answer === "Romantic relationships" && topic === "Romantic") {
            correct = true
        } else if (answer === "Mental wellbeing" && topic === "Mental") {
            correct = true
        } else if (
            answer === "Everyday / trivial activities" &&
            topic === "Trivial"
        ) {
            correct = true
        }

        data.attention_correct = correct
    },
}

// Conditional wrappers, like in your fiction task
var t_social_ratings_withcheck = {
    timeline: [social_ratings1_withcheck],
    conditional_function: function () {
        // Current conversation index = social_trialnumber - 1
        var conv_index = social_trialnumber - 1
        if (social_attention_trials.includes(conv_index)) {
            return true
        } else {
            return false
        }
    },
}

var t_social_ratings_nocheck = {
    timeline: [social_ratings1_base],
    conditional_function: function () {
        var conv_index = social_trialnumber - 1
        if (social_attention_trials.includes(conv_index)) {
            return false
        } else {
            return true
        }
    },
}

// First-pass block: all 6 vignettes in this (shuffled) order
var social_phase1 = {
    timeline_variables: social_stimuli,
    timeline: [
        social_vignette_intro,
        social_showimage1,
        t_social_ratings_withcheck,
        t_social_ratings_nocheck,
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
        completeText: text_instructionsbutton,
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
        var order_label = jsPsych.evaluateTimelineVariable("OrderLabel")
        return (
            "<h3>" +
            order_label +
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
                            description: "Move the slider towards ‘Artificial agent’ or ‘Human’ to reflect your belief.",
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
    timeline_variables: social_stimuli,
    timeline: [social_belief_image, social_belief_slider],
    randomize_order: false, // same order again
}

// ======================================================================
// ADMIT BLUFF + LONELINESS / FUTURE USE (3 DOMAINS)
// ======================================================================

var social_admit_bluff = {
    type: jsPsychSurvey,
    data: { screen: "social_admit_bluff" },
    survey_json: {
        showQuestionNumbers: false,
        completeText: text_instructionsbutton,
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
                                title:
                                    "How likely are you to carry out a conversation similar to the vignettes with a <b>close friend</b>?",
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
                                title:
                                    "How likely are you to carry out a conversation similar to the vignettes with an <b>AI</b> (in general)?",
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
                                title:
                                    "How likely are you to carry out a conversation similar to the vignettes with an <b>AI when feeling alone</b>?",
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
// social_timeline.push(social_admit_bluff)
// social_timeline.push(social_likelihood_trivial)
// social_timeline.push(social_likelihood_mental)
// social_timeline.push(social_likelihood_romantic)

// In your main script you’d do something like:
// var jsPsych = initJsPsych({ on_finish: function(){ jsPsych.data.displayData(); } });
// jsPsych.run(social_timeline);
