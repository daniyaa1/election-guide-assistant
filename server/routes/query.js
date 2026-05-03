const express = require("express");
const electionData = require("../data/electionData.json");

const router = express.Router();

function detectLanguage(question) {
  if (/[\u0980-\u09FF]/.test(question)) {
    return "bn";
  }

  if (/[\u0900-\u097F]/.test(question)) {
    return "hi";
  }

  const normalizedQuestion = question.toLowerCase();

  if (
    normalizedQuestion.includes("bengali") ||
    normalizedQuestion.includes("বাংলা")
  ) {
    return "bn";
  }

  if (
    normalizedQuestion.includes("hindi") ||
    normalizedQuestion.includes("हिंदी")
  ) {
    return "hi";
  }

  return "en";
}

function getLanguagePack(language) {
  if (language === "bn") {
    return {
      fallbackTitle: "আমি পুরো প্রশ্নটা ধরতে পারিনি",
      fallbackSteps: [
        "নির্বাচনী প্রক্রিয়া সম্পর্কে জিজ্ঞেস করতে পারেন।",
        "ভোট কীভাবে দেবেন, যোগ্যতা, বা সময়রেখা নিয়েও প্রশ্ন করতে পারেন।"
      ],
      fallbackExtra: "আমি নিশ্চিত নই, ভোট বা নির্বাচনের ধাপ নিয়ে জিজ্ঞেস করে দেখুন।",
      geminiDownTitle: "Gemini আপাতত উপলব্ধ নয়",
      geminiDownSteps: [
        "অ্যাপের built-in গাইড এখনও প্রক্রিয়া, ভোটদান, যোগ্যতা ও সময়রেখা নিয়ে উত্তর দিতে পারে।",
        "খোলা ধরনের প্রশ্নে Gemini ব্যবহার করতে চাইলে Google AI Studio বা Google Cloud-এ quota ও billing দেখে নিন।"
      ],
      geminiQuota: "Gemini সংযুক্ত আছে, কিন্তু এই API key-তে এখন ব্যবহারযোগ্য quota নেই।",
      geminiUnavailable: "Gemini এই মুহূর্তে উত্তর দিতে পারেনি, তাই অ্যাপটি নিজের গাইড ব্যবহার করছে।"
    };
  }

  if (language === "hi") {
    return {
      fallbackTitle: "मैं सवाल पूरी तरह समझ नहीं पाया",
      fallbackSteps: [
        "आप चुनाव प्रक्रिया के बारे में पूछ सकते हैं।",
        "आप वोट कैसे दें, पात्रता, या समयरेखा के बारे में भी पूछ सकते हैं।"
      ],
      fallbackExtra: "मुझे पूरा भरोसा नहीं है, मतदान या चुनाव के चरणों के बारे में पूछकर देखें।",
      geminiDownTitle: "Gemini फिलहाल उपलब्ध नहीं है",
      geminiDownSteps: [
        "ऐप की built-in guide अभी भी प्रक्रिया, मतदान, पात्रता और समयरेखा के सवालों का जवाब दे सकती है।",
        "Open-ended सवालों के लिए Gemini इस्तेमाल करने हेतु Google AI Studio या Google Cloud में quota और billing जांचें।"
      ],
      geminiQuota: "Gemini जुड़ा हुआ है, लेकिन इस API key पर अभी उपलब्ध quota नहीं है।",
      geminiUnavailable: "Gemini अभी उत्तर नहीं दे सका, इसलिए ऐप अपनी built-in guide का उपयोग कर रहा है।"
    };
  }

  return {
    fallbackTitle: "I couldn't match that topic",
    fallbackSteps: [
      "Try asking about the election process.",
      "You can also ask how to vote, eligibility, or the election timeline."
    ],
    fallbackExtra: "I'm not sure, try asking about voting or election steps.",
    geminiDownTitle: "Gemini is temporarily unavailable",
    geminiDownSteps: [
      "The built-in election guide still works for process, voting, eligibility, and timeline questions.",
      "To use Gemini for open-ended questions, check the API key quota and billing in Google AI Studio or Google Cloud."
    ],
    geminiQuota: "Gemini is connected, but the current API key has no available quota right now.",
    geminiUnavailable: "Gemini could not answer right now, so the app is using the built-in guide instead."
  };
}

function pickTopic(question) {
  const normalizedQuestion = question.toLowerCase();

  if (
    normalizedQuestion.includes("eligibility") ||
    normalizedQuestion.includes("eligible") ||
    normalizedQuestion.includes("can i vote") ||
    normalizedQuestion.includes("who can vote") ||
    normalizedQuestion.includes("am i eligible") ||
    normalizedQuestion.includes("যোগ্য") ||
    normalizedQuestion.includes("কে ভোট দিতে পারে") ||
    normalizedQuestion.includes("কারা ভোট দিতে পারে") ||
    normalizedQuestion.includes("पात्र") ||
    normalizedQuestion.includes("कौन वोट दे सकता") ||
    normalizedQuestion.includes("क्या मैं वोट दे सकता")
  ) {
    return "eligibility";
  }

  if (
    normalizedQuestion.includes("process") ||
    normalizedQuestion.includes("election process") ||
    normalizedQuestion.includes("election steps") ||
    normalizedQuestion.includes("election procedure") ||
    normalizedQuestion.includes("steps of election") ||
    normalizedQuestion.includes("how election works") ||
    normalizedQuestion.includes("প্রক্রিয়া") ||
    normalizedQuestion.includes("নির্বাচনের ধাপ") ||
    normalizedQuestion.includes("নির্বাচন কীভাবে হয়") ||
    normalizedQuestion.includes("प्रक्रिया") ||
    normalizedQuestion.includes("चुनाव के चरण") ||
    normalizedQuestion.includes("चुनाव कैसे होता है")
  ) {
    return "process";
  }

  if (
    normalizedQuestion.includes("vote") ||
    normalizedQuestion.includes("voting") ||
    normalizedQuestion.includes("voting steps") ||
    normalizedQuestion.includes("how to vote") ||
    normalizedQuestion.includes("polling station") ||
    normalizedQuestion.includes("ballot") ||
    normalizedQuestion.includes("ভোট") ||
    normalizedQuestion.includes("ভোটের ধাপ") ||
    normalizedQuestion.includes("কীভাবে ভোট") ||
    normalizedQuestion.includes("मतदान") ||
    normalizedQuestion.includes("मतदान के चरण") ||
    normalizedQuestion.includes("वोट कैसे")
  ) {
    return "votingSteps";
  }

  if (
    normalizedQuestion.includes("timeline") ||
    normalizedQuestion.includes("dates") ||
    normalizedQuestion.includes("schedule") ||
    normalizedQuestion.includes("সময়রেখা") ||
    normalizedQuestion.includes("তারিখ") ||
    normalizedQuestion.includes("समयरेखा") ||
    normalizedQuestion.includes("तारीख")
  ) {
    return "timeline";
  }

  return null;
}

function getTopicResponse(topicKey, language) {
  const topic = electionData[topicKey];

  if (!topic) {
    return null;
  }

  return topic[language] || topic.en;
}

function isFollowUpQuestion(question) {
  const normalizedQuestion = question.toLowerCase().trim();

  return (
    normalizedQuestion.split(/\s+/).length <= 8 ||
    normalizedQuestion.includes("what about") ||
    normalizedQuestion.includes("and ") ||
    normalizedQuestion.includes("also") ||
    normalizedQuestion.includes("more") ||
    normalizedQuestion.includes("details") ||
    normalizedQuestion.includes("আর") ||
    normalizedQuestion.includes("এটা") ||
    normalizedQuestion.includes("আরও") ||
    normalizedQuestion.includes("और") ||
    normalizedQuestion.includes("इसके") ||
    normalizedQuestion.includes("इसके बारे में")
  );
}

function getTopicFromHistory(history) {
  const userMessages = Array.isArray(history)
    ? history.filter((item) => item?.role === "user" && item?.text)
    : [];

  for (let index = userMessages.length - 1; index >= 0; index -= 1) {
    const topic = pickTopic(userMessages[index].text);

    if (topic) {
      return topic;
    }
  }

  return null;
}

function getFallbackResponse(language) {
  const copy = getLanguagePack(language);

  return {
    title: copy.fallbackTitle,
    steps: copy.fallbackSteps,
    extra: copy.fallbackExtra
  };
}

function getGeminiUnavailableResponse(reason, language) {
  const copy = getLanguagePack(language);

  return {
    title: copy.geminiDownTitle,
    steps: copy.geminiDownSteps,
    extra: reason === "quota" ? copy.geminiQuota : copy.geminiUnavailable
  };
}

async function askGemini(question, language, history) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return null;
  }

  try {
    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an election guide focused on West Bengal. Answer in ${
                    language === "bn"
                      ? "Bengali"
                      : language === "hi"
                        ? "Hindi"
                        : "English"
                  } only.
Use the recent chat context if the user is asking a follow-up.
Return valid JSON only with this exact shape:
{
  "title": "",
  "steps": ["", ""],
  "extra": ""
}
Keep it short, practical, and avoid unsupported current political claims.
Recent chat history:
${JSON.stringify(history || [])}
Question: ${question}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!result.ok) {
      const rawError = await result.text();

      return {
        error: result.status === 429 ? "quota" : "unavailable",
        rawError
      };
    }

    const data = await result.json();
    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return null;
    }

    const parsed = JSON.parse(rawText);

    return {
      title: parsed.title || "",
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      extra: parsed.extra || ""
    };
  } catch (error) {
    return {
      error: "unavailable",
      rawError: error.message
    };
  }
}

router.post("/", async (req, res) => {
  const question = req.body?.question || "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  const language = detectLanguage(question);
  const matchedTopic = pickTopic(question);
  const rememberedTopic =
    !matchedTopic && isFollowUpQuestion(question)
      ? getTopicFromHistory(history)
      : null;
  const topicToUse = matchedTopic || rememberedTopic;

  if (topicToUse) {
    return res.json(getTopicResponse(topicToUse, language));
  }

  const geminiReply = await askGemini(question, language, history);

  if (geminiReply?.title) {
    return res.json(geminiReply);
  }

  if (geminiReply?.error) {
    return res.json(getGeminiUnavailableResponse(geminiReply.error, language));
  }

  return res.json(getFallbackResponse(language));
});

module.exports = router;
module.exports.pickTopic = pickTopic;
module.exports.askGemini = askGemini;
module.exports.detectLanguage = detectLanguage;
module.exports.getTopicResponse = getTopicResponse;
module.exports.getTopicFromHistory = getTopicFromHistory;
